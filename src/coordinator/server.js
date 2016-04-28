var Coordinator = require('./Coordinator.js').Coordinator

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var COORDINATOR_PORT = 8000;

// Starts a new coordinator
var coordinator = new Coordinator()

app.listen(COORDINATOR_PORT);

function handler (req, res) {
  res.end('Path Hit: ' + req.url);
}

io.on('connection', function (socket) {
  socket.on('initiate', function (data) {
    /*
    Data: IP, etc.
    Generates a pid for that client, and then creates
    a room.
    */
    var pid = socket.id
    coordinator.addClient(pid, data)
  });
  socket.on('lookup', function (data, callback) {
    console.log("Server received lookup message")
    pid = coordinator.lookup(data['content_hash'])
    callback({'pid': pid})
  });
});