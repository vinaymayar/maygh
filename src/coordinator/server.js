/**
 * Maygh coordinator server.
 * Handles all the communication with clients.
 * @author: Anying Li, Lara Araujo, Vinay Mayar
 */

var Coordinator = require('./Coordinator.js').Coordinator

// Note: keeping the http server for now just for ease of
// manual testing.
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

// The Coordinator and Client communicate through the following messages:
//    'initiate': Sent on connection from client. Should add that client's
//                information to the coordinator state
//    'lookup': Looks up a client that has the specified content.
io.on('connection', function (socket) {
  // data: {}
  socket.on('initiate', function (data) {
    var pid = socket.id
    coordinator.addClient(pid, data)
  });
  // data: { 'content_hash': XXXXXX }
  socket.on('lookup', function (data, callback) {
    console.log("Server received lookup message")
    pid = coordinator.lookup(data['content_hash'])
    callback({'pid': pid})
  });
});