from flask import Flask
from flask_restful import Resource, Api, reqparse

import time

app = Flask(__name__)
api = Api(app)


class DTA(Resource):
  """docstring for HelloWorld"""

  def post(self):
    return self.get()

  def get(self):
    self.parser = reqparse.RequestParser()
    args = self.parser.parse_args()
    time.sleep(5)
    for arg in args:
      print(arg)
    return {'DTA': 'by Piotr Banas'}, {'Access-Control-Allow-Origin': '*'}


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

if __name__ == '__main__':
  app.run(debug=True)
