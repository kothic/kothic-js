//TODO: Extract kothic-leaflet to another project
window.Kothic = require("./src/kothic");
window.MapCSS = require("./src/style/mapcss");

window.Kothic.loadJSON = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status == 200) {
        try {
          callback(JSON.parse(xhr.responseText));
        } catch (err) {
          console.error(url, err);
        }
      } else {
        console.debug("failed:", url, xhr.status);
      }
    }
  }
  xhr.open("GET", url, true);
  xhr.send(null);
}
