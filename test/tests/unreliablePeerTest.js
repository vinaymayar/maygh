/**
 * In this test, the first client may fail randomly at any point after
 * the second client initiates loading.  It may also be the case that
 */

module.exports = new (function() {
  var isFirstClient = process.env.__NIGHTWATCH_ENV_KEY == 'chrome_1';
  var tests = this;

  if(isFirstClient) {
    tests['first client continually connects and disconnects'] = function(client) {
      for(totalWaitTime = 0; totalWaitTime < 7000;) {
        waitTime = Math.random() * 200;
        totalWaitTime += waitTime;
        client
          .url('http://localhost:8080/')
          .pause(waitTime)
      }
    }
  } else {
    tests['second client loads small image from somewhere'] = function(client) {
      client
        .pause(3000)
        .url('http://localhost:8080/')
        .waitForElementVisible('body', 1000)
        .expect.element('#image1').to.have.attribute('src').after(2000);
      client
        .expect.element('#image1').to.have.attribute('data-source')
        .which.matches(/^server|peer$/).after(100);
    }

    tests['second client loads large image from somewhere'] = function(client) {
      client
        .expect.element('#image2').to.have.attribute('src').after(4000);
      client
        .expect.element('#image2').to.have.attribute('data-source')
        .which.matches(/^server|peer$/).after(100);
    }
  }

  tests.after = function(client) {
    client.end();
  }

})();
