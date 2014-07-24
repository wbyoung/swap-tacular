'use strict';

describe('home page', function() {
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
  var fixture = __fixture('post/postsGET');
  beforeEach(function() {
    __sendFakeRequest(this.server, 'post/postsGET');
    visit('/');
  });
  it('is on home page', function() {
    expect(currentRouteName()).to.eql('index');
  });
  it('shows posts from users', function() {
    expect(find('ul.message li:first').text()).to
    .eql('I\'m really excited about using this new Swap service!');
  });
  it('shows posts in order starting with the most recent', function(){
    //TODO: expect firstPost.date > secondPost.date
  });
  describe('api requests', function() {
    it('makes one request', function() {
      expect(this.server.requests.length).to.eql(1);
      expect(this.server.requests[0].method).to.eql(fixture.request.method);
      expect(this.server.requests[0].url).to.eql(fixture.request.url);
    });
  });
});
