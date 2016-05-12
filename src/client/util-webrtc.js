const CHUNK_LENGTH = 50000; // DONT INCREASE THIS!
const TIMEOUT = 2000;

/**
 * creates a local webrtc peer connection
 * @param  remotePID    pid of the remote of this connection
 * @param  connectionID id of the connection, shared by both local and remote
 * @return              peer connection
 */
function createLocalPeerConnection(remotePID, connectionID, contentHash, loadFromPeer, loadFromSrc, isContentLoaded) {
  // console.log('createLocalConnection')

  var servers = null;
  var pcConstraints = null;
  var pc = new webkitRTCPeerConnection(servers, pcConstraints);

  var dataChannel = pc.createDataChannel('dataChannel')

  var contentChunks = [];
  var receivedAllContent = false;

  var loadFromSrcAndClosePC = function() {
    loadFromSrc();
    pc.close();
  };

  var establishConnectionTimeout = setTimeout(loadFromSrcAndClosePC, TIMEOUT);

  var messageTimeout;

  dataChannel.onmessage = function(event) {
    // if content has already been loaded, do nothing
    if (isContentLoaded()) {
      return;
    }
    clearTimeout(messageTimeout);
    console.log('onmessage in the local connection.')
    receivedAllContent = reassembleContentChunks(event, contentChunks, loadFromPeer);
    if (!receivedAllContent)
      messageTimeout = setTimeout(loadFromSrcAndClosePC, TIMEOUT);
    else
      pc.close();
  }

  dataChannel.onopen = function () {
    clearTimeout(establishConnectionTimeout);
    // console.log('DataChannel in local connection opened. Getting content ' + contentHash)
    dataChannel.send(contentHash);
    messageTimeout = setTimeout(loadFromSrcAndClosePC, TIMEOUT);
  };

  dataChannel.onclose = function () {
    if (pc.signalingState != 'closed')
      pc.close();
  };

  pc.onicecandidate = function(event) {
      sendIceCandidateToPeer(pc, remotePID, connectionID, 'local', event);
  };

  return pc;
}

function onReadContent(dataChannel, text) {
    var data = {}; // data object to transmit over data channel

    if (text.length > CHUNK_LENGTH) {
        data.message = text.slice(0, CHUNK_LENGTH); // getting chunk using predefined chunk length
    } else {
        data.message = text;
        data.last = true;
    }

    dataChannel.send(JSON.stringify(data)); // use JSON.stringify for chrome!

    var remainingContent = text.slice(data.message.length);
    if(remainingContent.length) {
      setTimeout(function () {
        onReadContent(dataChannel, remainingContent); // continue transmitting
      }, 1);
    }
}

function reassembleContentChunks(event, contentChunks, loadFromPeer) {
  var data = JSON.parse(event.data);

  contentChunks.push(data.message); // pushing chunks in array

  if (data.last) {
      // console.log('data.last == true')
      var datauri = contentChunks.join('');
      receivedContent = true;
      loadFromPeer(datauri);
  }

  return data.last;
}

/**
 * creates a remote webrtc peer connection
 * @param  localPID     pid of the local of this connection
 * @param  connectionID id of the connection, shared by both local and remote
 * @return              peer connection
 */
function createRemotePeerConnection(localPID, connectionID) {
  // console.log('createRemoteConnection')

  var servers = null;
  var pcConstraints = null;
  var pc = new webkitRTCPeerConnection(servers, pcConstraints);

  var closePeerTimeout = setTimeout(function() {
    pc.close();
  }, TIMEOUT);

  pc.ondatachannel = function(event){
    clearTimeout(closePeerTimeout)
    setRemoteChannelCallbacks(pc, event);
  };

  pc.onicecandidate = function(event) {
      sendIceCandidateToPeer(pc, localPID, connectionID, 'remote', event);
  };

  return pc;
}
/**
 * Set the callbacks for the datachannel in the remote connection
 */
function setRemoteChannelCallbacks(pc, event) {
  // console.log('setRemoteChannelCallbacks called')

  var dataChannel = event.channel;
  dataChannel.onmessage = function(event) {
      onRemoteMessageCallback(dataChannel, event);
  };

  dataChannel.onclose = function() {
    if (pc.signalingState != 'closed')
      pc.close();
    // console.log('Data Channel in the remote closed')
  }
}

function onRemoteMessageCallback(dataChannel, event) {
    // console.log('onRemoteMessageCallback called')
    // console.log(event.data)
    var contentHash = event.data
    var content = localStorage.getItem(contentHash)

    // console.log('remote sending data to local')
    // console.log('content size ' + content.length)
    onReadContent(dataChannel, content)
}

/**
 * Forwards the candidate to paired peer
 */
function sendIceCandidateToPeer(pc, toPeer, connectionID, peerType, event) {
    // console.log('got ice candidate')

    var eventListenerName = 'receiveIceCandidate-' +
                            getOtherPeerType(peerType) +
                            '-' +
                            connectionID;
    // console.log('send ice candidate on eventListenerName ' + eventListenerName + 'toPeer ' + toPeer)
    if (event.candidate) {
        maygh.socket.emit('sendIceCandidate',
            {
                'toPeer': toPeer,
                'candidate': event.candidate,
                'clientIceCandidateEventListenerName': eventListenerName
            });
    }
}


/**
 * Sends offer to paired peer
 */
function sendOfferToPeer(pc, data, loadFromSrc){
  // console.log('sendOfferToPeer called. connectionID is ' + data['connectionID'])

  var description = data['description']
  pc.setLocalDescription(description)

  maygh.socket.emit('sendOffer', data,
    function (res) {
        gotAnswer(pc, res, loadFromSrc)
    });
}

/**
 * Callback called when an answer to an offer is received
 */
function gotAnswer(pc, res, loadFromSrc) {
  // console.log('gotAnswerCallback called')

  var remoteDescription = res['description'];
  var success = res['success'];

  // console.log(res)
  if (success)
    pc.setRemoteDescription(new RTCSessionDescription(remoteDescription));
  else {
    loadFromSrc();
  }
}

function createAnswerSuccess(pc, description, callback) {
  // console.log('createAnswerSuccess')
  pc.setLocalDescription(description);
  callback({'description': description, 'success': true});
}

function createAnswerError(pc, error, callback) {
  // console.log('createAnswerError: ' + error)
  pc.close();
  callback({'success': false})
}

// Don't know exactly what are the implications of this
function addIceCandidateError(error) {
  // console.log('addIceCandidateError: ' + error)
}
