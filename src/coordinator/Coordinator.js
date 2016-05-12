/**
 * Maygh coordinator class.
 * Stores important state and supports coordinator-specific functions.
 * @author: Lara Araujo, Anying Li, Vinay Mayar
 */

function Coordinator() {
  // map from content hashes to lists of client
  // pids that have that content
  this.contentToClientMap = {};
  // inverse map from above.
  // map from client pids to lists of
  // content hashes stored by that client
  this.clientToContentMap = {};
}

// Looks up and returns a client that has the
// specified content.
// Returns null if no client has that content
Coordinator.prototype.lookup = function(contentHash) {
  var clients = this.contentToClientMap[contentHash]

  if (clients == null || clients.length == 0) {
    return null
  }

  var index = getRandomInt(0, clients.length)
  return clients[index]
};

Coordinator.prototype.addContentHashToClient = function (contentHash, client) {
  // adds client to content hash map
  if (this.contentToClientMap[contentHash] == null) {
    this.contentToClientMap[contentHash] = []
  }
  this.contentToClientMap[contentHash].push(client)

  // adds content hash to client map
  if (this.clientToContentMap[client] == null) {
    this.clientToContentMap[client] = []
  }
  this.clientToContentMap[client].push(contentHash)
}

Coordinator.prototype.removeUnresponsiveClients = function(io) {
  var clients = Object.keys(this.clientToContentMap)
  for (i = 0; i < clients.length; i++) {
    var client = clients[i]
    var connected = io.sockets.connected['/#' + client] // '/#' from socket.io convention
    if (!connected)
      this.removeClient(client)
  }
}

Coordinator.prototype.removeClient = function(client){
  var contentHashes = this.clientToContentMap[client]
  delete this.clientToContentMap[client]

  if (contentHashes) {
    for (i = 0; i < contentHashes.length; i++) {
      // console.log('removing content hash ' + contentHashes[i])
      this.removeClientFromContentHash(contentHashes[i], client)
    }
  }
}

Coordinator.prototype.removeClientFromContentHash = function(contentHash, client){
  var clients = this.contentToClientMap[contentHash]
  var index = clients.indexOf(client);
  if (index > -1)
    clients.splice(index, 1);
  // console.log(clients)
  this.contentToClientMap[contentHash] = clients
}

/**
 * Returns a random int in [start, end-1]
 */
function getRandomInt(start, end) {
  return Math.floor(Math.random() * end) + start
}

exports.Coordinator = Coordinator
