module.exports = new (function() {
  var isFirstClient = process.env.__NIGHTWATCH_ENV_KEY == 'chrome_1';
  var tests = this;

  if(isFirstClient) {
    tests['single client loads small image from server'] = function(client) {
      client
        .url('http://localhost:8080/')
        .waitForElementVisible('body', 1000)
        .expect.element('#image1').to.have.attribute('src').after(2000)
      client
        .expect.element('#image1').to.have.attribute('data-source')
        .which.equals('server').after(1000)
    }
  }

  tests.after = function(client) {
    client.end()
  }

})();
