# maygh
Implementation of Maygh for 6.824

## Running Tests

Download nightwatch:

`npm install -g nightwatch`

Choose an appropriate chromedriver binary for your machine by
editting test/nightwatch.json.  The default is bin/chromedriver_mac32.
The options are

* bin/chromedriver_mac32
* bin/chromedriver_linux32
* bin/chromedriver_linux64
* bin/chromedriver_win32.exe

Make sure no instances of the server or coordinator are already running on
ports 8000 and 8080:

`pkill -f node`

Run tests:

```
cd ./test
./run_tests.sh
```
