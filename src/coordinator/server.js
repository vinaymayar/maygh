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
const  HEARTBEATS_PERIOD = 50;

// Starts a new coordinator
var coordinator = new Coordinator()

app.listen(COORDINATOR_PORT);
function handler (req, res) {
  res.end('Path Hit: ' + req.url);
}


setInterval(function() {
    coordinator.removeUnresponsiveClients(io)
  }, HEARTBEATS_PERIOD);


// The Coordinator and Client communicate through the following messages:
//    'initiate': Sent on connection from client. Should add that client's
//                information to the coordinator state
//    'lookup': Looks up a client that has the specified content.
//    'update': Updates the information about a client
//    'connect': Connects two clients via WebRTC
io.on('connection', function (socket) {

  socket.on('lookup', function (data, callback) {
    // console.log("Server received lookup message")
    var res = {}

    res['pid'] = coordinator.lookup(data['contentHash'])
    res['success'] = (res['pid'] != null)

    callback(res)
  });

  socket.on('update', function (data) {
    // console.log("Server received update message")

    var contentHash = data['contentHash']
    var pid = socket.id.substring(2)
    // console.log("Coordinator received update message from " + pid + " for content hash " + contentHash);
    coordinator.addContentHashToClient(contentHash, pid)
    // console.log(coordinator.contentToClientMap)
  });

  socket.on('sendOffer', function (data, callback) {
    var toPeer = '/#' + data['toPeer'] // socket.io convention
    var fromPeer = socket.id.substring(2)
    var description = data['description']
    var connectionID = data['connectionID']

    if (io.sockets.connected[toPeer])
      io.sockets.connected[toPeer].emit('receiveOffer',
        {'description': description, 'fromPeer': fromPeer, 'connectionID': connectionID },
        function (res) {
          // console.log('received offer from peer. connectionID is ' + connectionID)
          callback(res)
        });
    else
      callback({'success': false})
  });

  socket.on('sendIceCandidate', function (data, callback) {
    var candidate = data['candidate']
    var toPeer = '/#' + data['toPeer']
    var clientListenerName = data['clientIceCandidateEventListenerName']
    // console.log("sendingIceCandidate in the server with clientListenerName " + clientListenerName)

    if (io.sockets.connected[toPeer])
      io.sockets.connected[toPeer].emit(clientListenerName, {'candidate': candidate})
  })
});


