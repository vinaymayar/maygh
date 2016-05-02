function WebRTC(socket, pid) {
    this.socket = socket
    this.pid = pid
    this.pc = null
    this.dataChannel = null
}

WebRTC.prototype.createLocalConnection = function() {
    var servers = null
    var pcConstraints = null

    this.pc = new RTCPeerConnection(servers, pcConstraint);

    this.dataChannel = this.pc.createDataChannel('dataChannel')
    this.dataChannel.onopen = onLocalChannelStateChange
    this.dataChannel.onclose = onLocalChannelStateChange

    this.pc.onicecandidate = gotIceCandidate
    this.pc.createOffer(sendOfferDescriptionToServer)
}


WebRTC.prototype.createRemoteConnection = function(description) {
    var servers = null
    var pcConstraints = null

    this.pc = new RTCPeerConnection(servers, pcConstraint);

    this.pc.ondatachannel = remoteChannelCallback

    this.pc.onicecandidate = gotIceCandidate

    this.pc.setRemoteDescription(description)

    this.pc.createAnswer(sendAnswerDescriptionToServer)

}

WebRTC.prototype.remoteChannelCallback = function(event) {
    this.dataChannel = event.channel
    this.dataChannel.onmessage = onRemoteMessageCallback
    this.dataChannel.onopen = onRemoteChannelStateChange
    this.dataChannel.onclose = onRemoteChannelStateChange
}

WebRTC.prototype.onRemoteMessageCallback = function(event) {
    // this is interesting, but not yet
    console.log(event.data)
}

WebRTC.prototype.onRemoteChannelStateChange = function() {
    var readyState = this.dataChannel.readyState
    if (readyState === 'open') {
        // set some stuff, don't send things though
    }
}

WebRTC.prototype.onLocalChannelStateChange = function() {
    var readyState = this.dataChannel.readyState
    if (readyState === 'open') {
        // send data
    }
}


WebRTC.prototype.sendOfferDescriptionToServer = function (description) {
    this.pc.setLocalDescription(description)
    this.socket.emit('sendOffer', {'description': description, 'pid': this.pid})
}

WebRTC.prototype.sendAnswerDescriptionToServer = function (description) {
    this.pc.setLocalDescription(description)
    this.socket.emit('sendAnswer', {'description': description, 'pid': this.pid})
}

WebRTC.prototype.gotIceCandidate = function () {

}