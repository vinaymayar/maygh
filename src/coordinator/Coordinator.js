function Coordinator() {
  this.contentToClientMap = {}
  this.clientToContentMap = {}
  this.clientsInfoMap = {}
}

Coordinator.prototype.lookup = function(contentHash) {
  return this.contentToClientMap[contentHash]
}

Coordinator.prototype.initiate = function(clientPID, clientInfo) {
  // TODO: check if client already exists
  this.clientsInfoMap[clientPID] = clientInfo
}

exports.Coordinator = Coordinator