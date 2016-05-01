/**
 * Maygh client
 *
 * @author: Anying Li, Lara Araujo, Vinay Mayar
 */

// Upon start connect via socket with the coordinator
// and send an initiate event, so the coordinator is
// aware of us.
var socket = io.connect('http://localhost:8000')

socket.on('connect', function () {
  socket.emit('initiate', {})
  console.log("Client connected")
});

maygh = new Maygh()

function Maygh() {

}
/**
 * Connects to a coordinator.  The coordinator object
 * passed as an argument is [TODO].
 */
Maygh.prototype.connect = function(coordinator) {
  //TODO: Connect to the coordinator
}

/**
 * Given a content hash and a src load content in to
 * the element with the given id.
 */
Maygh.prototype.load = function(contentHash, id, src) {
  console.log("called load")
  var domElt = document.getElementById(id);

  // check if item is already in localstorage
  if (localStorage.getItem(contentHash) != null) {
    domElt.src = localStorage.getItem(contentHash);
    return
  }

  // otherwise, look up the content w/ coordinator and then save to local storage
	socket.emit('lookup', {'contentHash': contentHash}, function(data) {
    console.log("my data is in the client: " + data);
    var pid = data['pid']
    domElt = document.getElementById(id)
    if (pid != null) {
      // asks server to connect to another client through WebRTC
      socket.emit('connect', {'pid': pid}, function(data) {
        loadFromPeer(contentHash, pid, domElt)
      })
    } else {
      loadFromSrc(contentHash, src, domElt)
    }

    // sends a update message telling the server, we have the element
    // in out local storage
    socket.emit('update', {'contentHash': contentHash})
  })
}

/**
 * Loads content with the given id from a peer
 * and displays it in the appropriate dom element
 */
function loadFromPeer(contentHash, pid, domElt) {
  //TODO: Load the content from a peer
  //TODO: Verify the hash
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
