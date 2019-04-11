import numpy as np
import cv2 as cv
import nrrd
import math
fname = "applied.txt"


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
  np.savetxt("".join((path, 'dataX.txt')), dataX, delimiter=',')
  np.savetxt("".join((path, 'dataY.txt')), dataY, delimiter=',')
  np.savetxt("".join((path, 'doses.txt')), doses, delimiter=',')


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
  firstX, lastX = get_first_and_last_matching_index(planned_dose.x, applied_dose.x)
  firstY, lastY = get_first_and_last_matching_index(planned_dose.y, applied_dose.y)
  adjusted_planned_dose = Dose(
      x=planned_dose.x[firstX:lastX + 1],
      y=planned_dose.y[firstY:lastY + 1],
      doses=planned_dose.doses[firstY:lastY + 1, firstX:lastX + 1]
  )

  save_data(planned_path,
            adjusted_planned_dose.x,
            adjusted_planned_dose.y,
            adjusted_planned_dose.doses)
  make_image(adjusted_planned_dose.doses, "".join((planned_path, "adjusted_planned")), 2)
  make_nrrd(adjusted_planned_dose.doses, "".join((planned_path, "adjusted_planned")))
  # Adjusting applied doses
  # Resize dose to desired size
  scale = 5
  additional_pixels = int(scale / 2)
  adjusted_applied_doses = \
      resize_doses(applied_dose.doses, scale)[additional_pixels:(0 - additional_pixels), additional_pixels:(0 - additional_pixels)]
  # # save to file
  save_data(applied_path,
            applied_dose.x,
            applied_dose.y,
            adjusted_applied_doses)
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
  cols, rows = dose_diff.shape
  van_dyk = np.zeros([cols, rows])
  for i in range(0, cols):
    for j in range(0, rows):
      if dose_diff[i, j] > reference_dose_tolerance[i, j] and DTA[i, j] > reference_distance_tolerance[i, j]:
        van_dyk[i, j] = 255
  return van_dyk


def make_DTA_matrix(adjusted_applied, chosen_plan, reference_distance_to_agreement):
  max_distance = 3 * int(reference_distance_to_agreement)
  cols, rows = adjusted_applied.shape
  frame = range(-max_distance, max_distance + 1)
  rdts_pow2 = reference_distance_to_agreement**2

  DTA = np.zeros([cols, rows])

  for i in range(0, cols):
    for j in range(0, rows):
      dmin = max_distance
      DM = adjusted_applied[i, j]

      for l in frame:
        for k in frame:
          if (i + k >= 1 and i + k < cols - 1 and j + l >= 1 and j + l < rows - 1):
            DC = chosen_plan[i + k, j + l]
            DCX = chosen_plan[i + k + 1, j + l]
            DCY = chosen_plan[i + k, j + l + 1]
            DCX1 = chosen_plan[i + k - 1, j + l]
            DCY1 = chosen_plan[i + k, j + l - 1]

            dx = dy = dx1 = dy1 = d1 = d2 = d3 = d4 = max_distance
            if DCX != DC:
              dx = (DM - DC) / (DCX - DC)
              if dx >= 0 and dx <= 1:
                d1 = math.sqrt((k + dx)**2 * rdts_pow2 +
                               l**2 * rdts_pow2)
            if DCY != DC:
              dy = (DM - DC) / (DCY - DC)
              if dy >= 0 and dy <= 1:
                d2 = math.sqrt(k**2 * rdts_pow2 +
                               (l + dy)**2 * rdts_pow2)
            if DCX1 != DC:
              dx1 = (DM - DC) / (DCX1 - DC)
              if dx1 >= 0 and dx1 <= 1:
                d3 = math.sqrt((k + dx1)**2 * rdts_pow2 +
                               l**2 * rdts_pow2)
            if DCY1 != DC:
              dy1 = (DM - DC) / (DCY1 - DC)
              if dy1 >= 0 and dy1 <= 1:
                d4 = math.sqrt(k**2 * rdts_pow2 +
                               (l + dy)**2 * rdts_pow2)
            minimum_d = min(d1, d2, d3, d4)
            if(minimum_d < dmin):
              dmin = minimum_d

      DTA[i, j] = dmin
  return DTA


def make_dose_diff_matrix(adjusted_applied, chosen_plan, min_percentage, reference_dose_tolerance):
  cols, rows = adjusted_applied.shape
  dose_diff = np.zeros([cols, rows])
  max_value_chosen_plan = np.amax(chosen_plan)
  minimal_value = min_percentage / 100 * max_value_chosen_plan
  for i in range(0, cols):
    for j in range(0, rows):
      if(chosen_plan[i, j] > minimal_value):
        if(abs(chosen_plan[i, j] - adjusted_applied[i, j]) > reference_dose_tolerance[i, j]):
          dose_diff[i, j] = 255
  return dose_diff


def make_gamma_matrix(adjusted_applied, chosen_plan, min_percentage, reference_distance_tolerance, reference_dose_tolerance):
  gamma = np.full_like(chosen_plan, 255.0)
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
  return np.full_like(plan, reference_distance_to_agreement)


def make_global_reference_dose_tolerance(plan, max_dose_diff):
  max_value_plan = np.amax(plan)
  init_dose_tolerance = max_dose_diff * max_value_plan / 100
  return np.full_like(plan, init_dose_tolerance)


def create_reference_distance_tolerance(chosen_plan, method, options):
  reference_distance_tolerance = None
  if method == 'global':
    reference_distance_tolerance = \
        make_global_reference_distance_tolerance(chosen_plan,
                                                 options['reference_distance_to_agreement'])
  elif method == 'clustering':
    pass
  elif method == 'local':
    pass
  else:
    raise ValueError('Invalid distance to agreement method')
  return reference_distance_tolerance


def create_reference_dose_tolerance(chosen_plan, method, options):
  reference_dose_tolerance = None
  if method == 'global':
    reference_dose_tolerance = \
        make_global_reference_dose_tolerance(chosen_plan,
                                             options['maximum_dose_difference'])
  elif method == 'clustering':
    pass
  elif method == 'local':
    pass
  else:
    raise ValueError('Invalid dose quality assesment method')
  return reference_dose_tolerance


def run(applied_plan, chosen_plan, options):
  gamma = van_dyk = dose_diff = None
  reference_distance_tolerance = \
      create_reference_distance_tolerance(chosen_plan,
                                          options['DTA_method'], options)
  reference_dose_tolerance = \
      create_reference_dose_tolerance(chosen_plan,
                                      options['DQA_method'], options)
  if(options['gamma'] == 'on'):
    gamma = make_gamma_matrix(applied_plan, chosen_plan, options['min_percentage'], reference_distance_tolerance, reference_dose_tolerance)
  if(options['dose_diff'] == 'on'):
    dose_diff = make_dose_diff_matrix(applied_plan, chosen_plan, options['min_percentage'], reference_dose_tolerance)
  if(options['van_dyk'] == 'on' and np.any(dose_diff)):
    DTA_matrix = make_DTA_matrix(applied_plan, chosen_plan, options['reference_distance_to_agreement'])
    van_dyk = make_van_dyk_matrix(dose_diff, DTA_matrix, reference_dose_tolerance, reference_distance_tolerance)

  return (gamma, dose_diff, van_dyk)
