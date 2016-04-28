/**
 * Maygh client
 *
 * @author: ?
 */
var socket = io.connect('http://localhost:8000')

socket.on('connect', function () { // TIP: you can avoid listening on `connect` and listen on events directly too!
  // TODO: send IP address, other data
  socket.emit('initiate', {})
  lookup("poo")
  console.log("Client connected")
});

/**
 * Connects to a coordinator.  The coordinator object
 * passed as an argument is [TODO].
 */
function connect(coordinator) {
  //TODO: Connect to the coordinator
}

/**
 * Loads content with the given id from a peer,
 * or, if unavailable, from the operator's website.
 */
function load(content_hash, id) {
  //TODO: Load the content
  //TODO: Verify the hash
  //TODO: Load from operator's website if unavailable.
}

function lookup(content_hash) {
  console.log("called lookup")
	socket.emit('lookup', {'content_hash': content_hash}, function(data) {
    console.log("my data is in da client: " + data)
  })
}
