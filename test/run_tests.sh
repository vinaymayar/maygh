#!/bin/bash

cd ../example-site
npm start &
cd ../test

if [ "$#" -eq 0 ]; then
    for filename in tests/*.js; do
        nightwatch --env chrome,chrome --test $filename
    done
else
    for filename in "$@"; do
        nightwatch --env chrome,chrome --test $filename
    done
fi

