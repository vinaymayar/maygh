module.exports = new (function() {
  var isFirstClient = process.env.__NIGHTWATCH_ENV_KEY == 'chrome_1';
  var tests = this;

  if(isFirstClient) {
    tests['first client connects to server and loads a new page'] = function(client) {
      client
        .url('http://localhost:8080/')
        .waitForElementVisible('body', 1000)
        .expect.element('#image1').to.have.attribute('src').after(2000);
      client
        .expect.element('#image2').to.have.attribute('src').after(4000);
      client
        .expect.element('#styles').to.have.attribute('href').after(1000);
      client
        .expect.element('#script').to.have.attribute('src').after(1000);
      client
        .url('http://google.com/')
        .pause(12000);
    };
  } else {
    tests['second client loads small image from server'] = function(client) {
      client
        .pause(6000)
        .url('http://localhost:8080/')
        .waitForElementVisible('body', 1000)
        .expect.element('#image1').to.have.attribute('src').after(2000);
      client
        .expect.element('#image1').to.have.attribute('data-source')
        .which.equals('server').after(100);
    };

    tests['second client loads large image from server'] = function(client) {
      client
        .expect.element('#image2').to.have.attribute('src').after(4000);
      client
        .expect.element('#image2').to.have.attribute('data-source')
        .which.equals('server').after(100);
    };

    tests['second client loads large image from server'] = function(client) {
      client
        .expect.element('#image2').to.have.attribute('src').after(4000);
      client
        .expect.element('#image2').to.have.attribute('data-source')
        .which.equals('server').after(100);
    };

    tests['second client loads css file from server'] = function(client)  {
      client
        .expect.element('#styles').to.have.attribute('href').after(1000);
      client
        .expect.element('#styles').to.have.attribute('data-source')
        .which.equals('server').after(100);
    };

    tests['second client loads js file from server'] = function(client)  {
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
