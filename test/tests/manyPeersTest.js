/**
 * In this test, many peers connect and disconnect from the coordinator.
 * The last one stays online, and should be a viable source from which
 * the second client can load static resources.
 */

module.exports = new (function() {
  var isFirstClient = process.env.__NIGHTWATCH_ENV_KEY == 'chrome_1';
  var tests = this;

  if(isFirstClient) {
    tests['first client connects to server many times, simulating large number of peers'] = function(client) {
      for(ctr = 100; ctr > 0; ctr--) {
        client
          .url('http://localhost:8080/')
      }
      client
        .waitForElementVisible('body', 1000)
        .expect.element('#image1').to.have.attribute('src').after(2000);
      client
        .expect.element('#image2').to.have.attribute('src').after(4000);
      client
        .expect.element('#styles').to.have.attribute('href').after(1000);
      client
        .expect.element('#script').to.have.attribute('src').after(1000);
      client
        .pause(30000);
    };
  } else {
    tests['second client loads small image from only remaining online peer'] = function(client) {
      client
        .pause(23000)
        .url('http://localhost:8080/')
        .waitForElementVisible('body', 1000)
        .expect.element('#image1').to.have.attribute('src').after(2000);
      client
        .expect.element('#image1').to.have.attribute('data-source')
        .which.equals('peer').after(100);
    };

    tests['second client loads large image from only remaining online peer'] = function(client) {
      client
        .expect.element('#image2').to.have.attribute('src').after(4000);
      client
        .expect.element('#image2').to.have.attribute('data-source')
        .which.equals('peer').after(100);
    };

    tests['second client loads css file from only remaining online peer'] = function(client)  {
      client
        .expect.element('#styles').to.have.attribute('href').after(1000);
      client
        .expect.element('#styles').to.have.attribute('data-source')
        .which.equals('peer').after(100);
    };

    tests['second client loads js file from only remaining online peer'] = function(client)  {
      client
        .expect.element('#script').to.have.attribute('src').after(1000);
      client
        .expect.element('#script').to.have.attribute('data-source')
        .which.equals('peer').after(100);
    };

  }

  tests.after = function(client) {
    client.end();
  };

})();
