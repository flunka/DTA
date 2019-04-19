import os
import random
import string
from flask import Flask, redirect, url_for, session
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse, abort
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
import numpy as np

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
    if 'id' not in session:
      session['id'] = generate_session_id()
    return {'Success': 'Welcome'}


def generate_session_id():
  return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(15))


def get_path(folder):
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
      upload_path = get_path(folder)
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
    planned_path = get_path('planned')
    applied_path = get_path('applied')
    adjusted_path = "".join((get_path('')[:-1], "adjusted"))
    get_path('adjusted_planned')
    get_path('adjusted_applied')
    planned_dose = create_dose(planned_path)
    applied_dose = create_dose(applied_path)
    make_images.adjust_doses(planned_dose, applied_dose, adjusted_path)
    return {'Success': 'Files have been adjusted successfully'}


class AlignDoses(Resource):
  """docstring for AlignDoses"""

  def __init__(self):
    super().__init__()
    self.parser = reqparse.RequestParser()

  def get(self):
    args = self.parser.parse_args()
    applied_path = get_path('adjusted_applied')
    adjusted_path = get_path('adjusted_planned')
    aligned_path = get_path('aligned')
    applied_dose = create_dose(applied_path)
    adjusted_dose = create_dose(adjusted_path)
    make_images.align_doses(adjusted_dose, applied_dose, aligned_path)
    return {'Success': 'Files have been aligned successfully'}


class Run(Resource):
  """docstring for Run"""

  def __init__(self):
    super().__init__()
    self.parser = reqparse.RequestParser()

    self.parser.add_argument('DQA_method', type=str, required=True)
    self.parser.add_argument('DTA_method', type=str, required=True)
    self.parser.add_argument('plan', type=str, required=True)
    self.parser.add_argument('gamma', type=str)
    self.parser.add_argument('van_dyk', type=str)
    self.parser.add_argument('dose_diff', type=str)
    self.parser.add_argument('min_percentage', type=float)
    self.parser.add_argument('plan_resolution', type=float)
    self.parser.add_argument('analysis', type=str)
    self.parser.add_argument('adjust_maximal_doses', type=str)
    self.parser.add_argument('adjust_minimal_doses', type=str)
    # Global
    self.parser.add_argument('maximum_dose_difference', type=float)
    self.parser.add_argument('reference_distance_to_agreement', type=float)
    # Clstering
    self.parser.add_argument('number_of_clusters', type=int)
    for x in range(0, 7):
      self.parser.add_argument('clustering_dose_tolerance_{}'.format(x), type=int)
    self.parser.add_argument('low_gradient_tolerance', type=int)
    self.parser.add_argument('high_gradient_tolerance', type=int)

    # Point-wise local
    self.parser.add_argument('max_probalility', type=float)
    self.parser.add_argument('surrogates', type=str)
    self.parser.add_argument('number_of_samples', type=float)
    self.parser.add_argument('max_probability_of_PTH_error', type=float)
    self.parser.add_argument('max_probability_of_PTH_error', type=float)
    self.parser.add_argument('coefficient_a', type=float)
    self.parser.add_argument('distance_local_method', type=str)

    ##Clustering and Piont-wise
    self.parser.add_argument('blur_of_surrogates', type=float)

  def post(self):
    args = self.parser.parse_args()
    applied_path = get_path('adjusted_applied')
    applied_dose = create_dose(applied_path)
    chosen_dose = None
    if(args['plan'] == "adjusted"):
      adjusted_path = get_path('adjusted_planned')
      chosen_dose = create_dose(adjusted_path)
    elif(args['plan'] == "aligned"):
      aligned_path = get_path('aligned')
      chosen_dose = create_dose(aligned_path)
    else:
      return abort(403, error_message='Invalid chosen plan!')
    gamma, dose_diff, van_dyk, reference_dose_tolerance, reference_distance_tolerance = \
        make_images.run(applied_dose.doses, chosen_dose.doses, args)
    gamma_url = dose_diff_url = van_dyk_url = ""
    result = {'gamma': gamma_url, 'dose_diff': dose_diff_url, 'van_dyk': van_dyk_url}
    print(np.any(gamma))
    if(np.any(gamma) != None):
      gamma_path = "".join((get_path('gamma'), 'gamma'))
      make_images.make_image(gamma, gamma_path, 2)
      make_images.make_nrrd(gamma, gamma_path)
      result["gamma"] = "".join(('/upload/', session['id'], '/gamma/gamma.jpg'))
      result["gamma_passing_rate"] = round((1 - np.count_nonzero(gamma) / gamma.size) * 100, 2)
    if(np.any(dose_diff) != None):
      dose_diff_path = "".join((get_path('dose_diff'), 'dose_diff'))
      make_images.make_image(dose_diff, dose_diff_path, 2)
      make_images.make_nrrd(dose_diff, dose_diff_path)
      result["dose_diff"] = "".join(('/upload/', session['id'], '/dose_diff/dose_diff.jpg'))
      result["dose_diff_passing_rate"] = round((1 - np.count_nonzero(dose_diff) / dose_diff.size) * 100, 2)
    if(np.any(van_dyk) != None):
      van_dyk_path = "".join((get_path('van_dyk'), 'van_dyk'))
      make_images.make_image(van_dyk, van_dyk_path, 2)
      make_images.make_nrrd(van_dyk, van_dyk_path)
      result["van_dyk"] = "".join(('/upload/', session['id'], '/van_dyk/van_dyk.jpg'))
      result["van_dyk_passing_rate"] = round((1 - np.count_nonzero(van_dyk) / van_dyk.size) * 100, 2)

    # Start of temporary code
    reference_dose_tolerance_path = get_path('reference_dose_tolerance')
    make_images.make_image(reference_dose_tolerance, "".join((reference_dose_tolerance_path, 'reference_dose_tolerance')))
    result["reference_dose_tolerance"] = "".join(('/upload/', session['id'], '/reference_dose_tolerance/reference_dose_tolerance.jpg'))
    reference_distance_tolerance_path = get_path('reference_distance_tolerance')
    make_images.make_image(reference_distance_tolerance, "".join((reference_distance_tolerance_path, 'reference_distance_tolerance')))
    result["reference_distance_tolerance"] = "".join(('/upload/', session['id'], '/reference_distance_tolerance/reference_distance_tolerance.jpg'))
    return result


api.add_resource(DTA, '/', '/DTA')
api.add_resource(AdjustDoses, '/AdjustDoses')
api.add_resource(AlignDoses, '/AlignDoses')
api.add_resource(UploadFile, '/Upload')
api.add_resource(GetImage, '/GetImage')
api.add_resource(Run, '/Run')

if __name__ == '__main__':
  app.run(debug=True)
