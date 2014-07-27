'use strict';

describe('actions on post', function() {
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

  describe('edits posts', function() {
    beforeEach(function() {
      __sendFakeRequest(this.server, 'post/postGETUser');
      visit('/profile');
    });
    it('is on the profile page', function() {
      expect(currentRouteName()).to.eql('profile');
      //TODO: Finish this test..
    });
  });

  describe('orders posts in descending order', function() {
    beforeEach(function() {
      __sendFakeRequest(this.server, 'post/postGETUser');
      visit('/profile');
    });
    beforeEach(function() {
      __sendFakeRequest(this.server, 'post/postOrder');
      visit('/');
    });
    it('will order posts by date', function() {
      expect(currentRouteName()).to.eql('index');
      expect(find('ul.message:first li').text()).to.eql('This should be first');
      expect(find('ul.message:nth-of-type(2) li').text()).to.eql('This should be second');
      expect(find('ul.message:last li').text()).to.eql('This should be last');
    });
  });

  describe('shows post page by sending single query request', function() {
    beforeEach(function() {
      __sendFakeRequest(this.server, 'post/postGET');
      visit('/post/50');
    });
    it.skip('will have one single post', function() {
      expect(currentRouteName()).to.eql('post.index');
      expect(find('ul.message:first li').text()).to.eql('I\'m really excited about using this new Swap service!');
      expect(find('button.edit.post:first').text()).to.eql('Edit');
      expect(find('button.edit.post')).to.exist;
    });
  });

  //TODO: Make this less gross looking.
  describe('post on create', function() {
    beforeEach(function() {
      visit('/create');
    });
    it('will have created a post on index page', function() {
      fillIn('textarea.message.post', 'HELLO WORLD!');
      var fixture = __fixture('post/postPOST');
      var self = this;
      __sendFakeRequest(this.server, 'post/postPOST');
      __sendFakeRequest(this.server, 'post/postsGET');
      click('button.create.post');
      andThen(function() {
        expect(this.server.requests.length).to.eql(2);
        expect(this.server.requests[0].method).to.eql(fixture.request.method);
        expect(this.server.requests[0].url).to.eql(fixture.request.url);
      }.bind(this));
      andThen(function() { expect(currentRouteName()).to.eql('index'); });
      andThen(function() {
        expect(find('ul.message li:first').text()).to
        .eql('HELLO WORLD!');
        var dateString = new Date(fixture.response.json.posts[0].createdAt).toString();
        expect(find('h6.timestamp:first').text()).to.eql(dateString);
      });
      andThen(function() {
        click('ul.message li:first a');
        andThen(function() {
          expect(currentRouteName()).to.eql('post.index');
          expect(find('button.edit.post')).to.exist;
          click('button.edit.post');
          fillIn('textarea.edit.post', 'HELLO!');
          // var fixture = __fixture('postPUT');
          __sendFakeRequest(self.server, 'post/postPUT');
          click('button.edit.done');
          andThen(function() {
            expect(self.server.requests.length).to.eql(3);
            expect(find('ul.message li:first').text()).to.eql('HELLO!');
          });
        });
      });
    });
  });
});
