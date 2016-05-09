/**
 * Maygh coordinator class.
 * Stores important state and supports coordinator-specific functions.
 * @author: ?
 */

const  UNRESPONSIVE_TIMEOUT = 1000;

function Coordinator() {
  // map from content hashes to lists of client
  // pids that have that content
  this.contentToClientMap = {};
  // inverse map from above.
  // map from client pids to lists of
  // content hashes stored by that client
  this.clientToContentMap = {};
  // map from client pids to dictionary of information
  // about that client
  // Ex: {1: {IP: 18.xxx.xxx.xxx, etc.}}
  this.clientsInfoMap = {};
}

// Looks up and returns a client that has the
// specified content.
// Returns null if no client has that content
Coordinator.prototype.lookup = function(contentHash) {
  clients = this.contentToClientMap[contentHash]
  if (clients == null || clients.length == 0) {
    return null
  }
  return clients[0]
};

// Adds a client to the clientsInfoMap with given clientInfo.
Coordinator.prototype.addClient = function(clientPID) {
  // TODO: check if client already exists
  var timestamp = (new Date).getTime()
  this.clientsInfoMap[clientPID] = timestamp
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

Coordinator.prototype.setClientTimestamp = function(clientPID, timestamp) {
  this.clientsInfoMap[clientPID] = timestamp
  // console.log('received heartbeat ' + timestamp + 'from client ' + clientPID)
}

Coordinator.prototype.removeUnresponsiveClients = function() {
  var clients = Object.keys(this.clientsInfoMap)
  for (i = 0; i < clients.length; i++) {
    var client = clients[i]
    if (isClientUnresponsive(this.clientsInfoMap[client]))
      this.removeClient(client)
  }
}

Coordinator.prototype.removeClient = function(client){
  var contentHashes = this.clientToContentMap[client]
  if (contentHashes) {
   for (i = 0; i < contentHashes.length; i++) {
    console.log('removing content hash ' + contentHashes[i])
      this.removeClientFromContentHash(contentHashes[i], client)
    }
  }
  delete this.clientToContentMap[client]
  delete this.clientsInfoMap[client]

  console.log('removed client ' + client)
}

Coordinator.prototype.removeClientFromContentHash = function(contentHash, client){
  var clients = this.contentToClientMap[contentHash]
  var index = clients.indexOf(client);
  if (index > -1)
    clients.splice(index, 1);
  console.log(clients)
  this.contentToClientMap[contentHash] = clients
}

function isClientUnresponsive(clientTimestamp){
  var now = (new Date).getTime()
  return now - clientTimestamp > UNRESPONSIVE_TIMEOUT

}


exports.Coordinator = Coordinator