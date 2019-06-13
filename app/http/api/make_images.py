import numpy as np
import cv2 as cv
import nrrd
import math
import numba
from numba import jit
from sklearn.cluster import KMeans
import pydicom


class Dose(object):
  """docstring for Dose"""

  def __init__(self, x, y, doses, file=False):
    super(Dose, self).__init__()
    if file:
      self.x = np.load(x)
      self.y = np.load(y)
      self.doses = np.load(doses)

    else:
      self.x = x
      self.y = y
      self.doses = doses


def make_applied_dose_image(file_name, path):
  file_extension = file_name.split(".")[-1]
  if file_extension == "dcm":
    make_dose_image_from_DICOM(file_name, path, "applied")
  elif file_extension == "txt" or file_extension == "snc":
    make_applied_dose_image_from_ArcCheck(file_name, path)
  else:
    raise ValueError("Wrong type of file")


def make_dose_image_from_DICOM(file_name, path, type_of_image):
  file = "".join((path, file_name))
  data = pydicom.dcmread(file)
  doses = data.pixel_array
  save_data(path, None, None, doses)
  # Create image
  make_image(doses, "".join((path, type_of_image)), 2)
  make_nrrd(doses, "".join((path, type_of_image)))


def make_applied_dose_image_from_ArcCheck(file_name, path):
  file = "".join((path, file_name))
  with open(file) as f:
    data = []
    dataX = []
    dataY = []
    dose = False
    col = False
    first_line_omitted = False
    for idx, line in enumerate(f):
      if("Dose Interpolated" in line):
        dose = True
      elif(dose and "COL" in line):
        col = True
      elif(dose and not col):
        if first_line_omitted:
          line = line.rstrip().split("\t")
          dataY.append(float(line[0]))
          data.append([float(x) for x in line[2:]])
        else:
          first_line_omitted = True
      elif col:
        line = line.split('\t')
        dataX = [float(x) for x in line[2:]]
        col = False
        dose = False
        break

  # Convert to numpy array
  doses = np.array(data)
  dataX = np.array(dataX)
  dataY = np.array(dataY)
  # # save to file
  save_data(path, dataX, dataY, doses)
  # Create image
  make_image(doses, "".join((path, "applied")), 10)
  make_nrrd(doses, "".join((path, "applied")))


def make_planned_dose_image(file_name, path):
  file_extension = file_name.split(".")[-1]
  if file_extension == "dcm":
    make_dose_image_from_DICOM(file_name, path, "planned")
  elif file_extension == "txt" or file_extension == "snc":
    make_planned_dose_image_from_ArcCheck(file_name, path)
  else:
    raise ValueError("Wrong type of file")


def make_planned_dose_image_from_ArcCheck(file_name, path):
  file = "".join((path, file_name))
  with open(file) as f:
    data = []
    dataX = []
    dataY = []
    for idx, line in enumerate(f):
      line = line.split()
      if(idx == 5):
        dataX = [float(x) / 10 for x in line[1:]]
      elif(idx > 5):
        dataY.append(float(line[0]) / 10)
        data.append([float(x) for x in line[1:]])
  # Conver to numpy array
  dataX = np.array(dataX)
  dataY = np.array(dataY)
  doses = np.array(data)
  # Save to file
  save_data(path, dataX, dataY, doses)
  # Create image
  make_image(doses, "".join((path, "planned")), 2)
  make_nrrd(doses, "".join((path, "planned")))


def make_nrrd(doses, path, scale=1):
  image = resize_doses(doses, scale)
  nrrd.write(".".join((path, 'nrrd')), np.transpose(image))


def make_image(doses, path, scale=1):
  image = resize_doses(doses, scale)
  normalized_image = cv.normalize(image, None, 255, 0, cv.NORM_MINMAX, cv.CV_8UC1)
  cv.imwrite(".".join((path, 'jpg')), normalized_image)


def save_data(path, dataX, dataY, doses):
  np.save("".join((path, "dataX")), dataX)
  np.save("".join((path, "dataY")), dataY)
  np.save("".join((path, "data")), doses)


def save_txt(path, dataX, dataY, doses):
  if(np.any(dataX) != None):
    np.savetxt("".join((path, 'dataX.txt')), dataX, delimiter=',', fmt="%3d")
  if(np.any(dataY) != None):
    np.savetxt("".join((path, 'dataY.txt')), dataY, delimiter=',', fmt="%3d")
  np.savetxt("".join((path, 'doses.txt')), doses, delimiter=',', fmt="%3d")


def order_idexes(cluster_centers):
  result = [0] * len(cluster_centers)
  for x in range(0, len(cluster_centers)):
    for y in range(0, len(cluster_centers)):
      if cluster_centers[x][0] > cluster_centers[y][0]:
        result[x] += 1
  return result


def get_first_and_last_matching_index(planned, applied):
  if applied[0] > applied[-1]:
    start = applied[-1]
    end = applied[0]
  else:
    start = applied[0]
    end = applied[-1]
  result = np.where(
      (planned >= start) &
      (planned <= end)
  )
  return result[0][0], result[0][-1]


def adjust_doses(planned_dose, applied_dose, path):
  planned_path = "".join((path, "_planned/"))
  applied_path = "".join((path, "_applied/"))
  if(np.any(planned_dose.x) != None):
    firstX, lastX = get_first_and_last_matching_index(planned_dose.x, applied_dose.x)
    firstY, lastY = get_first_and_last_matching_index(planned_dose.y, applied_dose.y)
    adjusted_planned_dose = Dose(
        x=planned_dose.x[firstX:lastX + 1],
        y=planned_dose.y[firstY:lastY + 1],
        doses=planned_dose.doses[firstY:lastY + 1, firstX:lastX + 1]
    )
  else:
    adjusted_planned_dose = Dose(x=None, y=None,
                                 doses=planned_dose.doses)

  save_data(planned_path,
            adjusted_planned_dose.x,
            adjusted_planned_dose.y,
            adjusted_planned_dose.doses)
  save_txt(path, None, None, adjusted_planned_dose.doses)
  make_image(adjusted_planned_dose.doses, "".join((planned_path, "adjusted_planned")), 2)
  make_nrrd(adjusted_planned_dose.doses, "".join((planned_path, "adjusted_planned")))
  if(np.any(planned_dose.x) != None):
    # Adjusting applied doses
    # Resize dose to desired size
    scale = 5
    additional_pixels = int(scale / 2)
    adjusted_applied_doses = \
        resize_doses(applied_dose.doses, scale)[additional_pixels:(0 - additional_pixels), additional_pixels:(0 - additional_pixels)]
  else:
    scale = planned_dose.doses.shape[0] / applied_dose.doses.shape[0]
    applied_dose.doses = resize_doses(applied_dose.doses, scale)
    adjusted_applied_doses = np.amax(applied_dose.doses) - applied_dose.doses
  # # save to file
  save_data(applied_path,
            applied_dose.x,
            applied_dose.y,
            adjusted_applied_doses)
  save_txt(path, None, None, adjusted_applied_doses)
  make_image(adjusted_applied_doses, "".join((applied_path, "adjusted_applied")), 2)
  make_nrrd(adjusted_applied_doses, "".join((applied_path, "adjusted_applied")))


def align_doses(adjusted_planned_dose, applied_dose, path):

  # Find size of image1
  width, height = np.shape(applied_dose.doses)

  # Define the motion model
  warp_mode = cv.MOTION_EUCLIDEAN

  # Define 2x3 or 3x3 matrices and initialize the matrix to identity
  if warp_mode == cv.MOTION_HOMOGRAPHY:
    warp_matrix = np.eye(3, 3, dtype=np.float32)
  else:
    warp_matrix = np.eye(2, 3, dtype=np.float32)

  # Specify the number of iterations.
  number_of_iterations = 5000

  # Specify the threshold of the increment
  # in the correlation coefficient between two iterations
  termination_eps = 1e-10

  # Define termination criteria
  criteria = (cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT, number_of_iterations, termination_eps)
  # Convert to float32
  applied_dose.doses = np.float32(applied_dose.doses)
  adjusted_planned_dose.doses = np.float32(adjusted_planned_dose.doses)
  # Run the ECC algorithm. The results are stored in warp_matrix.
  (cc, warp_matrix) = cv.findTransformECC(applied_dose.doses,
                                          adjusted_planned_dose.doses, warp_matrix,
                                          warp_mode, criteria)

  if warp_mode == cv.MOTION_HOMOGRAPHY:
    # Use warpPerspective for Homography
    aligned_doses = cv.warpPerspective(adjusted_planned_dose.doses,
                                       warp_matrix, (height, width),
                                       flags=cv.INTER_LINEAR + cv.WARP_INVERSE_MAP)
  else:
    # Use warpAffine for Translation, Euclidean and Affine
    aligned_doses = cv.warpAffine(adjusted_planned_dose.doses,
                                  warp_matrix, (height, width),
                                  flags=cv.INTER_LINEAR + cv.WARP_INVERSE_MAP)

  make_image(aligned_doses, "".join((path, "aligned")), 2)
  make_nrrd(aligned_doses, "".join((path, "aligned")))
  save_data(path,
            adjusted_planned_dose.x,
            adjusted_planned_dose.y,
            aligned_doses)


def resize_doses(doses, scale):
  colunms, rows = np.shape(doses)
  image = np.zeros([colunms, rows])
  image[:, :] = doses
  if scale != 1:
    image = cv.resize(image, None, fx=scale, fy=scale,
                      interpolation=cv.INTER_LINEAR)
  return image


def make_van_dyk_matrix(dose_diff, DTA, reference_dose_tolerance, reference_distance_tolerance):
  return np.where(dose_diff > reference_dose_tolerance,
                  np.where(DTA > reference_distance_tolerance, 255, 0),
                  0)


@jit(nopython=True)
def make_DTA_matrix(adjusted_applied, chosen_plan, reference_distance_tolerance, min_percentage):
  DTA = 2 * reference_distance_tolerance
  max_value_chosen_plan = np.amax(chosen_plan)
  minimal_value = min_percentage / 100 * max_value_chosen_plan
  cols, rows = adjusted_applied.shape
  for i in range(0, cols):
    for j in range(0, rows):
      if(chosen_plan[i, j] > minimal_value):
        min_delta = max_delta = adjusted_applied[i, j] - chosen_plan[i, j]
        frame = range(-int(reference_distance_tolerance[i, j]), int(reference_distance_tolerance[i, j]) + 1)
        for k in frame:
          for l in frame:
            if(k**2 + l**2 <= reference_distance_tolerance[i, j]**2 and
               i + k >= 0 and i + k < cols and j + l >= 0 and j + l < rows):
              delta = adjusted_applied[i, j] - chosen_plan[i + k, j + l]
              if delta < min_delta:
                min_delta = delta
              if delta > max_delta:
                max_delta = delta
        if DTA[i, j] != 0:
          if (max_delta > 0 and min_delta < 0):
            DTA[i, j] = 0
        if DTA[i, j] != 0:
          frame = range(-int(reference_distance_tolerance[i, j]) - 1, int(reference_distance_tolerance[i, j]) + 2)
          for k in frame:
            for l in frame:
              if(k**2 + l**2 > reference_distance_tolerance[i, j]**2 and
                 i + k >= 0 and i + k < cols and j + l >= 0 and j + l < rows):
                delta = adjusted_applied[i, j] - chosen_plan[i + k, j + l]
                second_frame_size = 2
                second_frame = range(-second_frame_size, second_frame_size + 1)
                for m in second_frame:
                  for n in second_frame:
                    if((k + m)**2 + (l + n)**2 > reference_distance_tolerance[i, j]**2 and
                       i + k + m >= 0 and i + k + m < cols and j + l + n >= 0 and j + l + n < rows):
                      delta2 = adjusted_applied[i, j] - chosen_plan[i + k + m, j + l + n]
                      if delta * delta2 < 0:
                        sx = m / (delta2 - delta) * delta2 + k
                        sy = n / (delta2 - delta) * delta2 + l
                        if sx**2 + sy**2 <= reference_distance_tolerance[i, j]**2:
                          DTA[i, j] = 0
      else:
        DTA[i, j] = 0
  return DTA


def make_dose_diff_matrix(adjusted_applied, chosen_plan, min_percentage, reference_dose_tolerance):
  max_value_chosen_plan = np.amax(chosen_plan)
  minimal_value = min_percentage / 100 * max_value_chosen_plan
  return np.where(chosen_plan > minimal_value,
                  np.where(np.absolute(chosen_plan - adjusted_applied) > reference_dose_tolerance, 255, 0),
                  0)


@jit(nopython=True)
def make_gamma_matrix(adjusted_applied, chosen_plan, min_percentage, reference_distance_tolerance, reference_dose_tolerance):
  gamma = np.full(chosen_plan.shape, 255.0)
  max_value_chosen_plan = np.amax(chosen_plan)
  minimal_value = min_percentage / 100 * max_value_chosen_plan
  cols, rows = adjusted_applied.shape
  for i in range(0, cols):
    for j in range(0, rows):
      if(chosen_plan[i, j] > minimal_value):
        min_delta = adjusted_applied[i, j] - chosen_plan[i, j]
        max_delta = adjusted_applied[i, j] - chosen_plan[i, j]
        frame = range(-int(reference_distance_tolerance[i, j]), int(reference_distance_tolerance[i, j]) + 1)
        for k in frame:
          for l in frame:
            if(k**2 + l**2 <= reference_distance_tolerance[i, j]**2 and
               i + k >= 0 and i + k < cols and j + l >= 0 and j + l < rows):
              delta = adjusted_applied[i, j] - chosen_plan[i + k, j + l]
              g = (delta**2) / (reference_dose_tolerance[i, j]**2)
              if g <= 1:
                gamma[i, j] = 0
              else:
                if delta < min_delta:
                  min_delta = delta
                if delta > max_delta:
                  max_delta = delta
        if gamma[i, j] != 0:
          if (max_delta > 0 and min_delta < 0):
            gamma[i, j] = 0
        if gamma[i, j] != 0:
          frame = range(-int(reference_distance_tolerance[i, j]) - 1, int(reference_distance_tolerance[i, j]) + 2)
          for k in frame:
            for l in frame:
              if(k**2 + l**2 > reference_distance_tolerance[i, j]**2 and
                 i + k >= 0 and i + k < cols and j + l >= 0 and j + l < rows):
                delta = adjusted_applied[i, j] - chosen_plan[i + k, j + l]
                second_frame_size = 2
                second_frame = range(-second_frame_size, second_frame_size + 1)
                for m in second_frame:
                  for n in second_frame:
                    if((k + m)**2 + (l + n)**2 > reference_distance_tolerance[i, j]**2 and
                       i + k + m >= 0 and i + k + m < cols and j + l + n >= 0 and j + l + n < rows):
                      delta2 = adjusted_applied[i, j] - chosen_plan[i + k + m, j + l + n]
                      if delta * delta2 < 0:
                        sx = m / (delta2 - delta) * delta2 + k
                        sy = n / (delta2 - delta) * delta2 + l
                        if sx**2 + sy**2 <= reference_distance_tolerance[i, j]**2:
                          gamma[i, j] = 0
      else:
        gamma[i, j] = 0
  return gamma


def make_global_reference_distance_tolerance(plan,
                                             reference_distance_to_agreement):
  return np.full(plan.shape, reference_distance_to_agreement)


def make_global_reference_dose_tolerance(plan, max_dose_diff):
  max_value_plan = np.amax(plan)
  init_dose_tolerance = max_dose_diff * max_value_plan / 100
  return np.full(plan.shape, init_dose_tolerance)


def make_clustering_reference_distance_tolerance(chosen_plan, low_gradient_tolerance, high_gradient_tolerance):
  gradient = np.gradient(chosen_plan)
  gradient_amplitude = np.sqrt(gradient[0]**2 + gradient[1]**2)
  kmeans = KMeans(n_clusters=2)
  cols, rows = gradient_amplitude.shape
  means = kmeans.fit(gradient_amplitude.reshape(gradient_amplitude.size, 1))
  cluster_centers = means.cluster_centers_
  cluster_labels = means.labels_
  max_value = max(cluster_centers)[0]
  reference_distance_tolerance = cluster_centers[cluster_labels].reshape(cols, rows)
  return np.where(reference_distance_tolerance == max_value,
                  high_gradient_tolerance,
                  low_gradient_tolerance)


def make_clustering_reference_dose_tolerance(chosen_plan, number_of_clusters, list_of_tolerances):
  kmeans = KMeans(n_clusters=number_of_clusters)
  cols, rows = chosen_plan.shape
  means = kmeans.fit(chosen_plan.reshape(chosen_plan.size, 1))
  cluster_centers = means.cluster_centers_
  cluster_labels = means.labels_
  order = order_idexes(cluster_centers)
  for x, y in zip(range(0, number_of_clusters), order):
    cluster_centers[x][0] *= list_of_tolerances[y] / 100
  return cluster_centers[cluster_labels].reshape(cols, rows)


def create_reference_distance_tolerance(chosen_plan, method, options):
  reference_distance_tolerance = None
  if method == 'global':
    reference_distance_to_agreement = options['reference_distance_to_agreement'] or 1
    reference_distance_tolerance = \
        make_global_reference_distance_tolerance(chosen_plan,
                                                 reference_distance_to_agreement)
  elif method == 'clustering':
    low_gradient_tolerance = options['low_gradient_tolerance'] or 1
    high_gradient_tolerance = options['high_gradient_tolerance'] or 1
    reference_distance_tolerance = \
        make_clustering_reference_distance_tolerance(chosen_plan, low_gradient_tolerance, high_gradient_tolerance)
  elif method == 'local':
    pass
  else:
    raise ValueError('Invalid distance to agreement method')
  return reference_distance_tolerance


def create_reference_dose_tolerance(chosen_plan, method, options):
  reference_dose_tolerance = None
  if method == 'global':
    maximum_dose_difference = options['maximum_dose_difference'] or 1
    reference_dose_tolerance = \
        make_global_reference_dose_tolerance(chosen_plan,
                                             maximum_dose_difference)
  elif method == 'clustering':
    list_of_tolerances = []
    if options['number_of_clusters']:
      number_of_clusters = options['number_of_clusters']
      for x in range(0, number_of_clusters + 1):
        list_of_tolerances.append(options['clustering_dose_tolerance_{}'.format(x)])
    else:
      number_of_clusters = 1
      list_of_tolerances = [1]
    reference_dose_tolerance = \
        make_clustering_reference_dose_tolerance(chosen_plan, number_of_clusters, list_of_tolerances)
  elif method == 'local':
    pass
  else:
    raise ValueError('Invalid dose quality assesment method')
  return reference_dose_tolerance


def adjust_maximal_doses(applied_dose, chosen_plan):
  max_applied_value = np.amax(applied_dose)
  min_applied_value = np.amin(applied_dose)
  max_planned_value = np.amax(chosen_plan)
  return (max_planned_value - min_applied_value) * (applied_dose - min_applied_value) / \
      (max_applied_value - min_applied_value) + min_applied_value


def adjust_minimal_doses(applied_dose, chosen_plan):
  min_applied_value = np.amin(applied_dose)
  max_applied_value = np.amax(applied_dose)
  min_planned_value = np.amin(chosen_plan)
  return (max_applied_value - min_planned_value) * (applied_dose - min_applied_value) / \
      (max_applied_value - min_applied_value) + min_planned_value


def adjust_min_and_min_doses(applied_dose, chosen_plan):
  min_applied_value = np.amin(applied_dose)
  max_applied_value = np.amax(applied_dose)
  min_planned_value = np.amin(chosen_plan)
  max_planned_value = np.amax(chosen_plan)
  return (max_planned_value - min_planned_value) * (applied_dose - min_applied_value) / \
      (max_applied_value - min_applied_value) + min_planned_value


def run(applied_dose, chosen_plan, options):
  gamma = van_dyk = dose_diff = None
  reference_distance_tolerance = \
      create_reference_distance_tolerance(chosen_plan,
                                          options['DTA_method'], options)
  reference_dose_tolerance = \
      create_reference_dose_tolerance(chosen_plan,
                                      options['DQA_method'], options)
  if options['analysis'] == 'relative':
    if options['adjust_maximal_doses']:
      if options['adjust_minimal_doses']:
        applied_dose = adjust_min_and_min_doses(applied_dose, chosen_plan)
      else:
        applied_dose = adjust_maximal_doses(applied_dose, chosen_plan)
    elif options['adjust_minimal_doses']:
      applied_dose = adjust_minimal_doses(applied_dose, chosen_plan)
  min_percentage = options['min_percentage'] or 0
  if(options['gamma'] == 'on'):
    gamma = make_gamma_matrix(applied_dose, chosen_plan, min_percentage, reference_distance_tolerance, reference_dose_tolerance)
  if(options['dose_diff'] == 'on'):
    dose_diff = make_dose_diff_matrix(applied_dose, chosen_plan, min_percentage, reference_dose_tolerance)
  if(options['van_dyk'] == 'on' and np.any(dose_diff) != None):
    DTA_matrix = make_DTA_matrix(applied_dose, chosen_plan, reference_distance_tolerance, min_percentage)
    van_dyk = make_van_dyk_matrix(dose_diff, DTA_matrix, reference_dose_tolerance, reference_distance_tolerance)
  return (gamma, dose_diff, van_dyk)
