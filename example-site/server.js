var express = require('express');
var path = require('path');
var port = 8080

express().use(express.static(path.join(__dirname, '/public'))).listen(port);
