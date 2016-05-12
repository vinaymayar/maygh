module.exports = new (function() {
  var isFirstClient = process.env.__NIGHTWATCH_ENV_KEY == 'chrome_1';
  var tests = this;

  if(isFirstClient) {
    tests['single client loads small image from server'] = function(client) {
      client
        .url('http://localhost:8080/')
        .waitForElementVisible('body', 1000)
        .expect.element('#image1').to.have.attribute('src').after(2000);
      client
        .expect.element('#image1').to.have.attribute('data-source')
        .which.equals('server').after(100);
    };

    tests['single client loads large image from server'] = function(client) {
      client
        .expect.element('#image2').to.have.attribute('src').after(4000);
      client
        .expect.element('#image2').to.have.attribute('data-source')
        .which.equals('server').after(100);
    };

    tests['single client loads css file from server'] = function(client)  {
      client
        .expect.element('#styles').to.have.attribute('href').after(1000);
      client
        .expect.element('#styles').to.have.attribute('data-source')
        .which.equals('server').after(100);
    };

    tests['single client loads js file from server'] = function(client)  {
      client
        .expect.element('#script').to.have.attribute('src').after(1000);
      client
        .expect.element('#script').to.have.attribute('data-source')
        .which.equals('server').after(100);
    };

  }

  tests.after = function(client) {
    client.end();
  };

})();
