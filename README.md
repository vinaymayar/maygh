# maygh

Implementation of Maygh for 6.824

## Running the Example Site

The example site uses the Maygh library to load four static resources:
two images, a script, and a CSS file.  To run the example site,

```
export MAYGH_HOME=$PWD
cd example-site
npm start
```

This will copy over the latest version of the Maygh library, start
a coordinator instance on port 8000, and start the example site web
server on port 8080.

To run the coordinator alone, 

```
export MAYGH_HOME=$PWD
cd src/coordinator
npm start
```

To run the example site web server without the coordinator,

```
export MAYGH_HOME=$PWD
cd example-site
node server
```

## Running Tests

Download nightwatch:

```
npm install -g nightwatch
```

Choose an appropriate chromedriver binary for your machine by
editting `test/nightwatch.json`.  The default is `bin/chromedriver_mac32`.
The options are

* `bin/chromedriver_mac32`
* `bin/chromedriver_linux32`
* `bin/chromedriver_linux64`
* `bin/chromedriver_win32.exe`

Make sure no instances of the server or coordinator are already running on
ports 8000 and 8080:

```
pkill -f node
```

Run tests:

```
cd test
./run_tests.sh
```

To run specific tests, simply pass the test files as arguments to `./run_tests.sh`:

```
./run_tests.sh tests/deadPeerTest.js
```
