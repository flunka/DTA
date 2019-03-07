import os
from flask import Flask, redirect, url_for
from flask_restful import Resource, Api, reqparse, abort
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage

import time

UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER') or '/var/www/upload/'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'snc'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
api = Api(app)


class DTA(Resource):
  """docstring for HelloWorld"""

  def __init__(self):
    super().__init__()
    self.parser = reqparse.RequestParser()

  def post(self):
    return self.get()

  def get(self):
    self.parser = reqparse.RequestParser()
    args = self.parser.parse_args()
    time.sleep(5)
    for arg in args:
      print(arg)
    return {'DTA': 'by Piotr Banas'}, {'Access-Control-Allow-Origin': '*'}


class UploadFile(Resource):
  """docstring for UploadFile"""

  def __init__(self):
    super().__init__()
    self.parser = reqparse.RequestParser()
    self.parser.add_argument('planned_dose_file', type=FileStorage, location='files')
    self.parser.add_argument('applied_dose_file', type=FileStorage, location='files')

  def allowed_file(self, filename):
    return '.' in filename \
        and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

  def post(self):
    args = self.parser.parse_args()
    uploaded_file = None
    planned = True
    if args['planned_dose_file']:
      uploaded_file = args['planned_dose_file']
    elif args['applied_dose_file']:
      uploaded_file = args['applied_dose_file']
      planned = False
    else:
      abort(403, error_message='File not selected')
    if uploaded_file and self.allowed_file(uploaded_file.filename):
      filename = secure_filename(uploaded_file.filename)
      folder = 'planned/' if planned else 'applied/'
      uploaded_file.save(os.path.join(app.config['UPLOAD_FOLDER'], folder, filename))
      print(os.path.join(app.config['UPLOAD_FOLDER'], filename))
      return {'Success': 'Planned dose file has been uploaded successfully'}, {'Access-Control-Allow-Origin': '*'}
    return abort(403, error_message='File formant not allowed')


class GlobalMethod(Resource):
  """docstring for GlobalMethod"""

  def __init__(self):
    super().__init__()
    self.parser = reqparse.RequestParser()
    self.parser.add_argument('test', type=bool, required=True)

  def post(self):
    args = self.parser.parse_args()
    if args['test']:
      return {'true': ''}
    else:
      return {'false': ''}


api.add_resource(DTA, '/', '/DTA')
api.add_resource(GlobalMethod, '/GlobalMethod')
api.add_resource(UploadFile, '/Upload')

if __name__ == '__main__':
  app.run(debug=True)
