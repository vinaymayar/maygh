function createLocalConnection = function() {
    console.log("createLocalConnection")
    var servers = null
    var pcConstraints = null

    this.pc = new RTCPeerConnection(servers, pcConstraint);

    this.dataChannel = this.pc.createDataChannel('dataChannel')
    this.dataChannel.onopen = onLocalChannelStateChange
    this.dataChannel.onclose = onLocalChannelStateChange

    this.pc.onicecandidate = gotIceCandidate
    this.pc.createOffer(sendOfferDescriptionToServer)
}


function createRemoteConnection = function(description) {
    console.log("createRemoteConnection")

    var servers = null
    var pcConstraints = null

    this.pc = new RTCPeerConnection(servers, pcConstraint);

    this.pc.ondatachannel = remoteChannelCallback

    this.pc.onicecandidate = gotIceCandidate

    this.pc.setRemoteDescription(description)

    this.pc.createAnswer(sendAnswerDescriptionToServer)

}

function remoteChannelCallback = function(event) {
    this.dataChannel = event.channel
    this.dataChannel.onmessage = onRemoteMessageCallback
    this.dataChannel.onopen = onRemoteChannelStateChange
    this.dataChannel.onclose = onRemoteChannelStateChange
}

function onRemoteMessageCallback = function(event) {
    // this is interesting, but not yet
    console.log(event.data)
}

function onRemoteChannelStateChange = function() {
    var readyState = this.dataChannel.readyState
    if (readyState === 'open') {
        // set some stuff, don't send things though
    }
}

function onLocalChannelStateChange = function() {
    var readyState = this.dataChannel.readyState
    if (readyState === 'open') {
        // send data
    }
}

function sendOfferDescriptionToServer = function (description) {
    this.pc.setLocalDescription(description)
    // this.socket.emit('sendOffer', {'description': description, 'pid': this.pid})
    this.createOfferSuccessSend(description, this.pid)
}

function sendAnswerDescriptionToServer = function (description) {
    this.pc.setLocalDescription(description)
    this.socket.emit('sendAnswer', {'description': description, 'pid': this.pid})
}

function gotIceCandidate = function () {

}