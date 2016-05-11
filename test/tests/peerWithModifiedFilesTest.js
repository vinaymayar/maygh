/**
 * This test checks that clients reject files if they've been modified.
 */

module.exports = new (function() {
  var isFirstClient = process.env.__NIGHTWATCH_ENV_KEY == 'chrome_1';
  var tests = this;

  if(isFirstClient) {
    tests['first client connects to server and modifies files'] = function(client) {
      client
        .url('http://localhost:8080/')
        .waitForElementVisible('body', 1000)
        .expect.element('#image1').to.have.attribute('src').after(2000);
      client
        .expect.element('#image2').to.have.attribute('src').after(4000);
      client
        .execute(function() {
          localStorage.setItem('824e4df3495213386844c0b2d6e781c6dd264697', 'fake-content1')
          localStorage.setItem('119e294567462e13faa0000ab8df22441d91f5f2', 'fake-content2')
        })
        .pause(10000);
    }
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
    }

    tests['second client loads large image from server'] = function(client) {
      client
        .expect.element('#image2').to.have.attribute('src').after(4000);
      client
        .expect.element('#image2').to.have.attribute('data-source')
        .which.equals('server').after(100);
    }
  }

  tests.after = function(client) {
    client.end();
  }

})();
