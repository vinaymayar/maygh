/**
 * Maygh client
 *
 * @author: Anying Li, Lara Araujo, Vinay Mayar
 */

// Upon start connect via socket with the coordinator
// and send an initiate event, so the coordinator is
// aware of us.
//


function Maygh() {
  // socket connecting client to coordinator
  this.socket = null
}

/**
 * Connects to a coordinator.  The coordinator object
 * passed as an argument is [TODO].
 */
Maygh.prototype.connect = function() {
  this.socket = io.connect('http://localhost:8000')

  this.socket.on('connect', function () {
    maygh.socket.emit('initiate', {})
    console.log("Client connected")
  });

  this.socket.on('receiveOffer',
    function (data, callback) {
      console.log("client received offer")
      var description = data['description']
      var fromPeer = data['fromPeer']
      console.log(description)
      pc = createRemotePeerConnection(fromPeer) // should set all callbacks
      pc.setRemoteDescription(new RTCSessionDescription(description))

      pc.createAnswer(
        function(description) {
          pc.setLocalDescription(description)
          callback({'description': description})
        },
        createAnswerFailCallback
      );

      maygh.socket.on('receiveIceCandidate', function (data) {
        var candidate = data['candidate']
        pc.addIceCandidate(new RTCIceCandidate(candidate))
        console.log("remote client got myself an ice candidateeeeeeeeeeee")
        console.log(pc)
      });

    });

  // needs to be listening for offers
  // create a remote peerconnection
  // set up all callbacks
  // call server call back with it's answer
};

/**
 * Given a content hash and a src load content in to
 * the element with the given id.
 */
Maygh.prototype.load = function(contentHash, id, src) {
  console.log("called load")
  var domElt = document.getElementById(id);

  // check if item is already in localstorage
  // if (localStorage.getItem(contentHash) != null) {
  //   domElt.src = localStorage.getItem(contentHash);
  //   return
  // }

  // otherwise, look up the content w/ coordinator and then save to local storage
	this.socket.emit('lookup', {'contentHash': contentHash},
    function(data) {
      lookupSuccessCallback(data, contentHash, src, domElt)
    });
};

/**
 * Loads content with the given id from a peer
 * and displays it in the appropriate dom element
 */
function loadFromPeer(contentHash, pid, domElt) {
  //TODO: Load the content from a peer
  //TODO: Verify the hash
}

function lookupSuccessCallback(data, contentHash, src, domElt) {
  console.log("lookupSuccessCallback called");
  console.log("contentHash is " + contentHash)

  var pid = data['pid']
  var success = data['success']
  console.log("success: " + success)

  if (success) {
    console.log("found peer " + pid)

    // create peerconnection and set up some callbacks
    pc = createLocalPeerConnection(pid)

    // create an offer from that peer connection
    pc.createOffer(
      function(description) {
        createOfferSuccessCallback(pc, pid, description)
      },
      createOfferFailCallback)

    maygh.socket.on('receiveIceCandidate', function (data) {
        var candidate = data['candidate']
        pc.addIceCandidate(new RTCIceCandidate(candidate))
        console.log("remote client got myself an ice candidateeeeeeeeeeee")
        console.log(pc)
      });

  } else {
    console.log("loaded contents from source")
    loadFromSrc(contentHash, src, domElt)

    // sends a update message telling the server, we have the element
    // in out local storage
    maygh.socket.emit('update', {'contentHash': contentHash})
  }
}
/**
 * Loads content from origin and displays it in the appropriate dom element
*/
function loadFromSrc(contentHash, src, domElt) {
  // Makes a GET request to src and grabs the data
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.open( "GET", src, true );
  xmlHttp.responseType = 'arraybuffer';

  // Asynchronous request
  xmlHttp.onreadystatechange = function (e) {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
      console.log("Callback was called")

      var arr = new Uint8Array(this.response);
      var b64 = encodeBase64(arr)

      var mime = getMimeType(src);
      var datauri = 'data:' + mime + ';base64,' + b64;
      localStorage.setItem(contentHash, datauri);
      domElt.src = datauri
    }
  };

  xmlHttp.send(null)
}

// Success callback from offer creation:
function createOfferSuccessCallback(pc, toPeer, description){
  console.log('createOfferSuccessCallback called')
  pc.setLocalDescription(description)
  var data = {'description': description, 'toPeer': toPeer}
  maygh.socket.emit('sendOffer', data,
    function (res) {
      gotAnswerCallback(pc, res)
    });
}

function createOfferFailCallback(error) {
  console.log("createOfferFailCallback: " + error)
}

function gotAnswerCallback(pc, res) {
  console.log("gotAnswerCallback called")
  var remoteDescription = res['description']
  var success = res['success']
  console.log(res)
  if (success)
    pc.setRemoteDescription(new RTCSessionDescription(remoteDescription))
  else {
    console.log("gotAnswerCallback error")
  }

}

function createAnswerFailCallback(error) {
  console.log('createAnswerFailCallback: ' + error)
}

var maygh = new Maygh();
maygh.connect()
