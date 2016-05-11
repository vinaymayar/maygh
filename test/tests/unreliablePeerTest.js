module.exports = new (function() {
  var isFirstClient = process.env.__NIGHTWATCH_ENV_KEY == 'chrome_1';
  var tests = this;

  if(isFirstClient) {
    tests['first client continually connects and disconnects'] = function(client) {
      for(ctr = 100; ctr > 0; ctr--) {
        client
          .url('http://localhost:8080/')
      }
    }
  } else {
    tests['second client loads small image from somewhere'] = function(client) {
      client
        .pause(2000)
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
