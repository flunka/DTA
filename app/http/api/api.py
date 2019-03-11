import os
import random
import string
from flask import Flask, redirect, url_for, session
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse, abort
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage

import time

import make_images

UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER') or './static/upload'
ALLOWED_EXTENSIONS = set(['txt', 'snc'])

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
cors = CORS(app, supports_credentials=True)
api = Api(app)


class DTA(Resource):
  """docstring for HelloWorld"""

  def __init__(self):
    super().__init__()

  def post(self):
    return self.get()

  def get(self):
    return {'Success': 'Welcome'}, {'Access-Control-Allow-Origin': '*'}


class GetImage(Resource):
  """docstring for GetImage"""

  def __init__(self):
    super().__init__()
    self.parser = reqparse.RequestParser()
    self.parser.add_argument('planned', type=bool)
    self.parser.add_argument('applied', type=bool)

  def get(self):
    args = self.parser.parse_args()
    if args['planned']:
      file = '/planned/plan.jpg'
    elif args['applied']:
      file = '/applied/applied.jpg'
    else:
      return abort(403, error_message='No type of image')
    if 'id' in session:
      url = "".join(('http://localhost:5000/static/upload/', session['id'], file))
      return {'image': url}
    else:
      return abort(403, error_message='No session id')


class UploadFile(Resource):
  """docstring for UploadFile"""

  def __init__(self):
    super().__init__()
    self.parser = reqparse.RequestParser()
    self.parser.add_argument('planned_dose_file', type=FileStorage, location='files')
    self.parser.add_argument('applied_dose_file', type=FileStorage, location='files')

  def generate_session_id(self):
    return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(15))

  def allowed_file(self, filename):
    return '.' in filename \
        and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

  def post(self):
    if 'id' not in session:
      session['id'] = self.generate_session_id()
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
      folder = '/'.join((session['id'], folder))
      upload_path = os.path.join(app.config['UPLOAD_FOLDER'], folder)
      if not os.path.exists(upload_path):
        os.makedirs(upload_path)
      uploaded_file.save("".join((upload_path, filename)))
      if planned:
        make_images.make_planned_dose_image(file_name=filename, path=upload_path)
      else:
        make_images.make_applied_dose_image(file_name=filename, path=upload_path)
      return {'Success': 'Planned dose file has been uploaded successfully'}
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
api.add_resource(GetImage, '/GetImage')

if __name__ == '__main__':
  app.run(debug=True)
