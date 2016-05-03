function createLocalPeerConnection() {
    console.log("createLocalConnection")
    var servers = null
    var pcConstraints = null

    pc = new webkitRTCPeerConnection(servers, pcConstraints);

    dataChannel = pc.createDataChannel('dataChannel')
    dataChannel.onopen = function () {
        // send a message telling the peer to send us a content hash
        dataChannel.send("Hi, pls hear me.")
    }
    dataChannel.onclose = function () {
        console.log("Data Channel closed.")
    }

    pc.onicecandidate = gotIceCandidate

    return pc
}


function createRemotePeerConnection() {
    console.log("createRemoteConnection")

    var servers = null
    var pcConstraints = null

    pc = new RTCPeerConnection(servers, pcConstraint);

    pc.ondatachannel = remoteChannelCallback

    pc.onicecandidate = gotIceCandidate

    return pc

}
// Set the callbacks for the datachannel in the remote connection
function remoteChannelCallback(event) {
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

function gotIceCandidate() {
    console.log("im empty like your soul")
}