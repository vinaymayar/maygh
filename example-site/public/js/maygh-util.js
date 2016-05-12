/**
 * Convert the int array to a binary string
 * We have to use apply() as we are converting an *array*
 * and String.fromCharCode() takes one or more single values, not
 * an array.
 */
function encodeBase64(arr){
  var raw = '';
  var i,j,subArray,chunk = 5000;
  for (i=0,j=arr.length; i<j; i+=chunk) {
    subArray = arr.subarray(i,i+chunk);
    raw += String.fromCharCode.apply(null, subArray);
  }

  return btoa(raw);
}

/**
 * Gets the mime type of a filename
 */
function getMimeType(filename) {
  var type = "image/jpeg";
  if (filename.match(/.jpg$/i)) type = "image/jpeg";
  else if (filename.match(/.jpeg$/i)) type = "image/jpeg";
  else if (filename.match(/.gif$/i)) type = "image/gif";
  else if (filename.match(/.png$/i)) type = "image/png";
  else if (filename.match(/.css$/i)) type = "text/css";
  else if (filename.match(/.js$/i)) type = "application/x-javascript";
  else if (filename.match(/.swf$/i)) type = "application/x-shockwave-flash";
  else if (filename.match(/.bmp$/i)) type = "image/bmp";
  else if (filename.match(/.html$/i)) type = "text/html";
  else if (filename.match(/.mp3$/i)) type = "audio/mpeg";
  else if (filename.match(/.mpeg$/i)) type = "video/mpeg";
  else if (filename.match(/.svg$/i)) type = "image/svg+xml";
  else if (filename.match(/.tiff$/i)) type = "image/tiff";
  else if (filename.match(/.txt$/i)) type = "text/plain";
  else if (filename.match(/.xml$/i)) type = "application/xml";
  else {
    //    log.warn("Warning: Unable to determine content type of " + filename);
    type = "application/x-binary";
  }
  return type;
}

/**
 * Timestamp + contentHash = UID
 */
function generateUID(contentHash) {
  var timestamp = new Date().getTime().toString();
  return timestamp + contentHash;
}


/**
 * Returns 'remote' if peerType is 'local', and 'local' otherwise.
 */
function getOtherPeerType(peerType) {
  if (peerType === 'local') {
    return 'remote';
  }
  return 'local';
}

function setDomEltContent(domElt, content) {
  if(domElt.tagName.toUpperCase() === 'IMG' ||
      domElt.tagName.toUpperCase() === 'SCRIPT' ||
      domElt.tagName.toUpperCase() === 'STYLE' ||
      domElt.tagName.toUpperCase() === 'IFRAME') {
    domElt.src = content;
  } else if(domElt.tagName.toUpperCase() == 'LINK') {
    domElt.href = content;
  } else if(domElt.tagName.toUpperCase() == 'OBJECT') {
    domElt.data = content;
  }
}

function sleep(millis) {
  var date = new Date();
  var curDate = null;
  do { curDate = new Date(); }
  while(curDate-date < millis);
}
