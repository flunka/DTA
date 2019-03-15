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
        data.append([float(x) for x in line.rstrip().split("\t")[2:]])
      elif col:
        dataX = [float(x) for x in line.split('\t')[2:-1]]
        col = False
        dose = False
        break
  doses = np.array(data[1:])
  colunms, rows = np.shape(doses)
  image = np.zeros([colunms, rows])
  image[:, :] = doses
  image = cv.resize(image, None, fx=5, fy=5, interpolation=cv.INTER_CUBIC)
  normalized_image = cv.normalize(image, None, 255, 0, cv.NORM_MINMAX, cv.CV_8UC1)
  cv.imwrite("".join((path, "/applied.jpg")), normalized_image)


def make_planned_dose_image(file_name, path):
  file = "".join((path, file_name))
  omited_begining_lines = 0
  with open(file) as f:
    data = []
    for idx, line in enumerate(f):
      if(idx == 5):
        dataX = [float(x) / 10 for x in line.split("\t")[1:-1]]
      elif(idx > 5):
        if(omited_begining_lines < 11):
          omited_begining_lines += 1
        else:
          data.append([float(x) for x in line.split("\t")[15:-12]])  # Zapytać
  doses = np.array(data[:-4])
  print(doses)
  colunms, rows = np.shape(doses)
  image = np.zeros([colunms, rows])
  image[:, :] = doses
  normalized_image = cv.normalize(image, None, 255, 0, cv.NORM_MINMAX, cv.CV_8UC1)
  cv.imwrite("".join((path, "plan.jpg")), normalized_image)
