function Coordinator() {
  this.contentToClientMap = {};
  this.clientToContentMap = {};
  this.clientsInfoMap = {};
}

Coordinator.prototype.lookup = function(contentHash) {
  clients = this.contentToClientMap[contentHash]
  if (clients == null || clients.length == 0) {
    return null
  }
  return clients[0]
};

Coordinator.prototype.addClient = function(clientPID, clientInfo) {
  // TODO: check if client already exists
  this.clientsInfoMap[clientPID] = clientInfo
};

exports.Coordinator = Coordinator