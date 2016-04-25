/**
 * Maygh client
 *
 * @author: ?
 */
var socket = io('http://localhost')

socket.on('connect', function () { // TIP: you can avoid listening on `connect` and listen on events directly too!
  console.log("hehehehe i conntected")
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
