#!/bin/bash

cd ../example-site
npm start &
cd ../test
nightwatch --env chrome,chrome

