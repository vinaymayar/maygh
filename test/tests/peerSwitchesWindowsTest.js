/**
 * This test checks that resources can be loaded from a peer even if
 * that peer is focused on a different window.
 */

module.exports = new (function() {
  var isFirstClient = process.env.__NIGHTWATCH_ENV_KEY == 'chrome_1';
  var tests = this;

  if(isFirstClient) {
    tests['first client connects and switches to another window'] = function(client) {
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
        .execute(function() {
          window.open('http://www.google.com', null, "height=1024,width=768");
        }, [])
        .window_handles(function(result) {
          this.switchWindow(result.value[1]);
        })
        .waitForElementVisible('body', 2000)
        .pause(12000);
    };
  } else {
    tests['second client loads small image from peer'] = function(client) {
      client
        .pause(6000)
        .url('http://localhost:8080/')
        .waitForElementVisible('body', 1000)
        .expect.element('#image1').to.have.attribute('src').after(2000);
      client
        .expect.element('#image1').to.have.attribute('data-source')
        .which.equals('peer').after(100);
    };

    tests['second client loads large image from peer'] = function(client) {
      client
        .expect.element('#image2').to.have.attribute('src').after(4000);
      client
        .expect.element('#image2').to.have.attribute('data-source')
        .which.equals('peer').after(100);
    };

    tests['second client loads css file from peer'] = function(client)  {
      client
        .expect.element('#styles').to.have.attribute('href').after(1000);
      client
        .expect.element('#styles').to.have.attribute('data-source')
        .which.equals('peer').after(100);
    };

    tests['second client loads js file from peer'] = function(client)  {
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
