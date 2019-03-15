import numpy as np
import cv2 as cv
fname = "applied.txt"


def make_applied_dose_image(file_name, path):
  file = "".join((path, file_name))
  with open(file) as f:
    data = []
    dose = False
    col = False
    for idx, line in enumerate(f):
      if("Dose Interpolated" in line):
        dose = True
      elif(dose and "COL" in line):
        col = True
      elif(dose and not col):
        data.append([float(x) for x in line.split("\t")[2:-1]])
      elif col:
        dataX = [float(x) for x in line.split('\t')[2:-1]]
        col = False
        dose = False
        break
  doses = np.array(data[1:])
  colunms, rows = np.shape(doses)
  image = np.zeros([colunms, rows, 3])
  image[:, :, 0] = doses
  image[:, :, 1] = doses
  image[:, :, 2] = doses
  image = cv.resize(image, None, fx=5, fy=5, interpolation=cv.INTER_CUBIC)
  cv.imwrite("".join((path, "/applied.jpg")), image)


def make_planned_dose_image(file_name, path):
  file = "".join((path, file_name))
  with open(file) as f:
    data = []
    for idx, line in enumerate(f):
      if(idx == 5):
        dataX = [float(x) / 10 for x in line.split("\t")[1:-1]]
      elif(idx > 5):
        data.append([float(x) for x in line.split("\t")[1:-1]])  # Zapytać
  doses = np.array(data)
  colunms, rows = np.shape(doses)
  image = np.zeros([colunms, rows, 3])
  image[:, :, 0] = doses
  image[:, :, 1] = doses
  image[:, :, 2] = doses
  cv.imwrite("".join((path, "plan.jpg")), image)
