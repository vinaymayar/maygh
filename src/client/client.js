/**
 * Maygh client
 *
 * @author: ?
 */

var socket = io.connect('http://localhost:8000')

socket.on('connect', function () { // TIP: you can avoid listening on `connect` and listen on events directly too!
  // TODO: send IP address, other data
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

Maygh.prototype.load = function(contentHash, id, src) {
  console.log("called load")
  var domElt = document.getElementById(id);

  // check if item is already in localstorage
  // if (localStorage.getItem(contentHash) != null) {
  //   domElt.src = localStorage.getItem(contentHash);
  //   return
  // }

  // otherwise, look up the content w/ coordinator and then save to local storage
	socket.emit('lookup', {'contentHash': contentHash}, function(data) {
    console.log("my data is in da client: " + data);
    var pid = data['pid']
    console.log("pid: " + pid)
    domElt = document.getElementById(id)
    if (pid != null) {
      loadFromPeer(contentHash, pid, domElt)
    } else {
      loadFromSrc(contentHash, src, domElt)
    }


  })
}

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function getMimeType(filename) {
  var type = "image/jpeg";
  if (filename.match(/.jpg$/i)) type = "image/jpeg";
  else if (filename.match(/.jpeg$/i)) type = "image/jpeg";
  else if (filename.match(/.gif$/i)) type = "image/gif";
  else if (filename.match(/.png$/i)) type = "image/png";
  else {
//    log.warn("Warning: Unable to determine content type of " + filename);
    type = "application/x-binary";
  }
  return type;
}

/**
 * Loads content with the given id from a peer,
 */
function loadFromPeer(contentHash, pid, domElt) {
  //TODO: Load the content from a peer
  //TODO: Verify the hash
}

/**
* Loads content from origin.
*/
function loadFromSrc(contentHash, src, domElt) {
  // Makes a GET request to src and grabs the data
  console.log("blahblahblah")
  var xmlHttp = new XMLHttpRequest()
  // TODO: change to asynchronous
  xmlHttp.open( "GET", src, true ); // false for synchronous request
  xmlHttp.onreadystatechange = function (){
    console.log("Callback was called 1")
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
      console.log("Callback was called")
      var txt = xmlHttp.responseText;

      var b64_txt = encodeBase64(txt);
      var mime = getMimeType(src);
      var datauri = 'data:' + mime + ';base64,' + b64_txt;
      localStorage.setItem(contentHash, datauri);
      domElt.src = ""
      console.log(domElt.src)
    }
  };
  xmlHttp.send(null)


}

function encodeBase64(txt){
  var b = new Buffer(txt);
  var s = b.toString('base64');
  // var binary = ""
  // for (i = 0; i < txt.length; i++) {
  //   binary += String.fromCharCode(txt.charCodeAt(i) & 255)
  // }

  // return btoa(binary)
  return s
}
