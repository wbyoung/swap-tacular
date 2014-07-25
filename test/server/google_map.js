'use strict';

describe('maps', function() {
  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.autoRespond = true;

    var container = applicationContainer();
    var session = container.lookup('auth-session:main');
    session.set('content', {
      id: 2,
      username: 'fake-username',
      token: 'fake-token'
    });
  });
  afterEach(function() {
    this.server.restore();
    App.reset();
  });
  beforeEach(function() {
    __sendFakeRequest(this.server, 'post/postGETUser');
    visit('/profile');
  });

  it.skip('should make a post with a location', function(done) {
    Promise.bind({})
    .then();
    });
});
