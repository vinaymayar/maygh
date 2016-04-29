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
  else {
//    log.warn("Warning: Unable to determine content type of " + filename);
    type = "application/x-binary";
  }
  return type;
}