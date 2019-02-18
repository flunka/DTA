#!/bin/bash
#Start backend
cd ./app/http/api
cd ../../..
#Start frontend
cd ./app/http/web
yarn start &
cd ../../..

