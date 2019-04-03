import numpy as np
import cv2 as cv
import nrrd
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
