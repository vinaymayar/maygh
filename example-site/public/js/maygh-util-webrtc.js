function createLocalPeerConnection(remotePID) {
    console.log("createLocalConnection")
    var servers = null
    var pcConstraints = null

    pc = new webkitRTCPeerConnection(servers, pcConstraints);

    dataChannel = pc.createDataChannel('dataChannel')
    dataChannel.onopen = function () {
        console.log("dataChannel opened")
        // send a message telling the peer to send us a content hash
        dataChannel.send("Hi, pls hear me.")
    }
    dataChannel.onclose = function () {
        console.log("Data Channel closed.")
    }

    pc.onicecandidate = function(event) {
        gotIceCandidate(pc, remotePID, event)
    }

    return pc
}


function createRemotePeerConnection(remotePID) {
    console.log("createRemoteConnection")

    var servers = null
    var pcConstraints = null

    pc = new webkitRTCPeerConnection(servers, pcConstraints);

    pc.ondatachannel = remoteChannelCallback

    pc.onicecandidate = function(event) {
        gotIceCandidate(pc, remotePID, event)
    }

    return pc

}
// Set the callbacks for the datachannel in the remote connection
function remoteChannelCallback(event) {
    console.log("remoteChannelCallback called")
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

function gotIceCandidate(pc, remotePID, event) {
    console.log("got ice candidate")
    if (event.candidate) {
        maygh.socket.emit('sendIceCandidate',
            {'toPeer': remotePID, 'candidate': event.candidate})
    }
}