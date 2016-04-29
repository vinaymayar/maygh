/**
 * Maygh coordinator class.
 * Stores important state and supports coordinator-specific functions.
 * @author: ?
 */

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
Coordinator.prototype.addClient = function(clientPID, clientInfo) {
  // TODO: check if client already exists
  this.clientsInfoMap[clientPID] = clientInfo
};

exports.Coordinator = Coordinator