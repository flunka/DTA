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


def generate_session_id():
  return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(15))


def create_path(folder):
  if 'id' not in session:
    session['id'] = generate_session_id()
  folder = '/'.join((session['id'], folder, ""))
  path = os.path.join(app.config['UPLOAD_FOLDER'], folder)
  if not os.path.exists(path):
    os.makedirs(path)
  return path


def create_dose(path):
  dose = make_images.Dose(
      x="".join((path, 'dataX.npy')),
      y="".join((path, 'dataY.npy')),
      doses="".join((path, 'data.npy')),
      file=True)
  return dose


class GetImage(Resource):
  """docstring for GetImage"""

  def __init__(self):
    super().__init__()
    self.parser = reqparse.RequestParser()
    self.parser.add_argument('type', type=str)

  def get(self):
    args = self.parser.parse_args()
    if args['type']:
      file = '/{0}/{0}.jpg'.format(args['type'])
    else:
      return abort(403, error_message='No type of image')
    if 'id' in session:
      url = "".join(('/upload/', session['id'], file))
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
      folder = 'planned' if planned else 'applied'
      upload_path = create_path(folder)
      uploaded_file.save("".join((upload_path, filename)))
      if planned:
        make_images.make_planned_dose_image(file_name=filename, path=upload_path)
      else:
        make_images.make_applied_dose_image(file_name=filename, path=upload_path)
      return {'Success': 'Planned dose file has been uploaded successfully'}
    return abort(403, error_message='File format not allowed')


class AdjustDoses(Resource):
  """docstring for AdjustDoses"""

  def __init__(self):
    super().__init__()
    self.parser = reqparse.RequestParser()

  def get(self):
    args = self.parser.parse_args()
    planned_path = create_path('planned')
    applied_path = create_path('applied')
    adjusted_path = create_path('adjusted')
    planned_dose = create_dose(planned_path)
    applied_dose = create_dose(applied_path)
    make_images.adjust_doses(planned_dose, applied_dose, adjusted_path)


class AlignDoses(Resource):
  """docstring for AlignDoses"""

  def __init__(self):
    super().__init__()
    self.parser = reqparse.RequestParser()

  def get(self):
    args = self.parser.parse_args()
    applied_path = create_path('applied')
    adjusted_path = create_path('adjusted')
    aligned_path = create_path('aligned')
    applied_dose = create_dose(applied_path)
    adjusted_dose = create_dose(adjusted_path)
    make_images.align_doses(adjusted_dose, applied_dose, aligned_path)


api.add_resource(DTA, '/', '/DTA')
api.add_resource(AdjustDoses, '/AdjustDoses')
api.add_resource(AlignDoses, '/AlignDoses')
api.add_resource(UploadFile, '/Upload')
api.add_resource(GetImage, '/GetImage')

if __name__ == '__main__':
  app.run(debug=True)
