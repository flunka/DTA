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
        data.append([float(x) * 2.5 for x in line.split("\t")[2:-1]])
      elif col:
        dataX = [float(x) for x in line.split('\t')[2:-1]]
        col = False
        dose = False
        break
  colunms, rows = np.shape(np.array(data[1:]))
  image = np.zeros([colunms, rows, 3])
  image[:, :, 0] = np.array(data[1:])
  image[:, :, 1] = np.array(data[1:])
  image[:, :, 2] = np.array(data[1:])
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
        data.append([float(x) * 2.5 for x in line.split("\t")[1:-1]])  # Zapytać
  colunms, rows = np.shape(np.array(data))
  image = np.zeros([colunms, rows, 3])
  image[:, :, 0] = np.array(data)
  image[:, :, 1] = np.array(data)
  image[:, :, 2] = np.array(data)
  cv.imwrite("".join((path, "plan.jpg")), image)
