/**
 * creates a local webrtc peer connection
 * @param  remotePID    pid of the remote of this connection
 * @param  connectionID id of the connection, shared by both local and remote
 * @return              peer connection
 */
const CHUNK_LENGTH = 50000; // DONT INCREASE THIS!
const UNRESPONSIVE_COORDINATOR_TIMEOUT = 100

function createLocalPeerConnection(remotePID, connectionID, contentHash, loadContent) {
    console.log('createLocalConnection')

    var servers = null
    var pcConstraints = null
    var pc = new webkitRTCPeerConnection(servers, pcConstraints);

    var dataChannel = pc.createDataChannel('dataChannel')
    var contentChunks = [];
    var receivedAllContent = false

    dataChannel.onmessage = function(event) {
        console.log('onmessage in the local connection')
        receivedAllContent = reassembleContentChunks(event, contentChunks, loadContent)
    }
    dataChannel.onopen = function () {
        console.log('DataChannel in local connection opened. Getting content ' + contentHash)
        dataChannel.send(contentHash)
    }
    dataChannel.onclose = function () {
        if (!receivedAllContent)
            console.log('Data channel for '+ contentHash + ' closed during file transfer')
        else
            console.log('Data channel for '+ contentHash + ' closed after file transfer')
    }

    pc.onicecandidate = function(event) {
        sendIceCandidateToPeer(pc, remotePID, connectionID, 'local', event)
    }

    return pc
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
    if (remainingContent.length) setTimeout(function () {
        onReadContent(dataChannel, remainingContent); // continue transmitting
    }, 1)
}

function reassembleContentChunks(event, contentChunks, loadContent) {
    var data = JSON.parse(event.data);

    contentChunks.push(data.message); // pushing chunks in array

    if (data.last) {
        console.log('data.last == true')
        var datauri = contentChunks.join('')
        receivedContent = true
        loadContent(datauri)
    }

    return data.last
}

/**
 * creates a remote webrtc peer connection
 * @param  localPID     pid of the local of this connection
 * @param  connectionID id of the connection, shared by both local and remote
 * @return              peer connection
 */
function createRemotePeerConnection(localPID, connectionID) {
    console.log('createRemoteConnection')

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
    console.log('setRemoteChannelCallbacks called')

    var dataChannel = event.channel
    dataChannel.onmessage = function (event) {
        onRemoteMessageCallback(dataChannel, event)
    }

    dataChannel.onopen =  function () {
        console.log('Data Channel in the remote opened')
    }

    dataChannel.onclose = function () {
        console.log('Data Channel in the remote closed')
    }
}

function onRemoteMessageCallback(dataChannel, event) {
    console.log('onRemoteMessageCallback called')
    console.log(event.data)
    var contentHash = event.data
    var content = localStorage.getItem(contentHash)

    console.log('remote sending data to local')
    console.log('content size ' + content.length)
    onReadContent(dataChannel, content)
}

/**
 * Forwards the candidate to paired peer
 */
function sendIceCandidateToPeer(pc, toPeer, connectionID, peerType, event) {
    console.log('got ice candidate')

    var eventListenerName = 'receiveIceCandidate-' +
                            getOtherPeerType(peerType) +
                            '-' +
                            connectionID;
    console.log('send ice candidate on eventListenerName ' + eventListenerName + 'toPeer ' + toPeer)
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
function sendOfferToPeer(pc, data, unresponsivePeerError, unresponsiveCoordinatorError){
  console.log('sendOfferToPeer called. connectionID is ' + data['connectionID'])

  var description = data['description']
  pc.setLocalDescription(description)

  var timeout = setTimeout(unresponsiveCoordinatorError, UNRESPONSIVE_COORDINATOR_TIMEOUT);

  maygh.socket.emit('sendOffer', data,
    function (res) {
        clearTimeout(timeout)
        gotAnswer(pc, res, unresponsivePeerError)
    });
}

/**
 * Callback called when an answer to an offer is received
 */
function gotAnswer(pc, res, unresponsivePeerError) {
  console.log('gotAnswerCallback called')

  var remoteDescription = res['description']
  var success = res['success']

  console.log(res)
  if (success)
    pc.setRemoteDescription(new RTCSessionDescription(remoteDescription))
  else {
    console.log('gotAnswer error')
    var lookupSuccess = res['lookupSuccess']
    var pid = res['pid']
    var data = {'success': lookupSuccess, 'pid': pid}
    unresponsivePeerError(data)
  }

}


// Maybe should do something more interesting with these...
function createAnswerError(error) {
  console.log('createAnswerError: ' + error)
}

function createOfferError(error) {
  console.log('createOfferError: ' + error)
}
