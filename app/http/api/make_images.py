import numpy as np
import cv2 as cv
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
        dataX = [float(x) for x in line[2:-1]]
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
  make_image(doses, "".join((path, "applied.jpg")), 10)


def make_planned_dose_image(file_name, path):
  file = "".join((path, file_name))
  with open(file) as f:
    data = []
    dataX = []
    dataY = []
    for idx, line in enumerate(f):
      line = line.split()
      if(idx == 5):
        dataX = [float(x) / 10 for x in line[1:-1]]
      elif(idx > 5):
        dataY.append(float(line[0]) / 10)
        data.append([float(x) for x in line[1:-1]])
  # Conver to numpy array
  dataX = np.array(dataX)
  dataY = np.array(dataY)
  doses = np.array(data)
  # Save to file
  save_data(path, dataX, dataY, doses)
  # Create image
  make_image(doses, "".join((path, "plan.jpg")), 2)


def make_image(doses, path, scale=1):
  colunms, rows = np.shape(doses)
  image = np.zeros([colunms, rows])
  image[:, :] = doses
  if scale != 1:
    image = cv.resize(image, None, fx=scale, fy=scale, interpolation=cv.INTER_CUBIC)
  normalized_image = cv.normalize(image, None, 255, 0, cv.NORM_MINMAX, cv.CV_8UC1)
  cv.imwrite(path, normalized_image)


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
  step = 5
  firstX, lastX = get_first_and_last_matching_index(planned_dose.x, applied_dose.x)
  firstY, lastY = get_first_and_last_matching_index(planned_dose.y, applied_dose.y)
  adjusted_planned_dose = Dose(
      x=planned_dose.x[firstX:lastX + step + 1:step],
      y=planned_dose.y[firstY:lastY + 1:step],
      doses=planned_dose.doses[firstY:lastY + 1:step, firstX:lastX + step + 1:step]
  )

  save_data(path,
            adjusted_planned_dose.x,
            adjusted_planned_dose.y,
            adjusted_planned_dose.doses)
  make_image(adjusted_planned_dose.doses, "".join((path, "adjusted.jpg")), 10)
