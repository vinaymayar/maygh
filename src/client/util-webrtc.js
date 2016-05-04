/**
 * creates a local webrtc peer connection
 * @param  remotePID    pid of the remote of this connection
 * @param  connectionID id of the connection, shared by both local and remote
 * @return              peer connection
 */
function createLocalPeerConnection(remotePID, connectionID) {
    console.log("createLocalConnection")

    var servers = null
    var pcConstraints = null
    var pc = new webkitRTCPeerConnection(servers, pcConstraints);

    dataChannel = pc.createDataChannel('dataChannel')

    dataChannel.onopen = function () {
        console.log("dataChannel opened")
        dataChannel.send("Hi, pls hear me.")
    }
    dataChannel.onclose = function () {
        console.log("Data Channel closed.")
    }

    pc.onicecandidate = function(event) {
        sendIceCandidateToPeer(pc, remotePID, connectionID, 'local', event)
    }

    return pc
}

/**
 * creates a remote webrtc peer connection
 * @param  localPID     pid of the local of this connection
 * @param  connectionID id of the connection, shared by both local and remote
 * @return              peer connection
 */
function createRemotePeerConnection(localPID, connectionID) {
    console.log("createRemoteConnection")

    var servers = null
    var pcConstraints = null
    var pc = new webkitRTCPeerConnection(servers, pcConstraints);

    pc.ondatachannel = setRemoteChannelCallbacks

    pc.onicecandidate = function(event) {
        sendIceCandidateToPeer(pc, localPID, connectionID, 'remote', event)
    }

    return pc

}
/**
 * Set the callbacks for the datachannel in the remote connection
 */
function setRemoteChannelCallbacks(event) {
    console.log("setRemoteChannelCallbacks called")

    var dataChannel = event.channel
    dataChannel.onmessage = onRemoteMessageCallback

    dataChannel.onopen =  function (){
        console.log("Data Channel in the remote opened")
        dataChannel.send("get my msg pls")
    }
    dataChannel.onclose = function () {
        console.log("Data Channel in the remote closed")
    }
}

function onRemoteMessageCallback(event) {
    // this is interesting, but not yet
    console.log(event.data)
}

/**
 * Forwards the candidate to paired peer
 */
function sendIceCandidateToPeer(pc, remotePID, connectionID, peerType, event) {
    console.log("got ice candidate")

    var eventListenerName = 'receiveIceCandidate-' +
                            getOtherPeerType(peerType) +
                            '-' +
                            connectionID;

    if (event.candidate) {
        maygh.socket.emit('sendIceCandidate',
            {
                'toPeer': remotePID,
                'candidate': event.candidate,
                'clientIceCandidateEventListenerName': eventListenerName
            });
    }
}


/**
 * Sends offer to paired peer
 */
function sendOfferToPeer(pc, toPeer, connectionID, description){
  console.log('sendOfferToPeer called')

  pc.setLocalDescription(description)

  var data = {'description': description, 'toPeer': toPeer, 'connectionID': connectionID}
  maygh.socket.emit('sendOffer', data,
    function (res) {
      gotAnswer(pc, res)
    });
}

/**
 * Callback called when an answer to an offer is received
 */
function gotAnswer(pc, res) {
  console.log("gotAnswerCallback called")

  var remoteDescription = res['description']
  var success = res['success']

  console.log(res)
  if (success)
    pc.setRemoteDescription(new RTCSessionDescription(remoteDescription))
  else {
    console.log("gotAnswer error")
  }

}


// Maybe should do something more interesting with these...
function createAnswerError(error) {
  console.log('createAnswerError: ' + error)
}

function createOfferError(error) {
  console.log("createOfferError: " + error)
}
