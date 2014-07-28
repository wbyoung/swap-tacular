'use strict';

describe('comments on post', function() {
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
    __sendFakeRequest(this.server, 'post/postsGET');
    __sendFakeRequest(this.server, 'comment/commentsGET');
    visit('/');
    click('ul.message:first li a');
  });
  it('has a comment button', function() {
    expect(find('button.comment.post').text()).to.eql('Comment');
    expect(find('button.comment.post').length).to.exist;
  });

  it('has no input areas before comment buttons is clicked', function() {
    expect(find('textarea.comment.post').length).to.eql(0);
  });

  it('will create an input area when comment btn is clicked', function() {
    click('button.comment.post');
    andThen(function() {
      expect(find('textarea.comment.post').length).to.eql(1);
    });
  });

  it('will hide the comment btn when clicked', function() {
    click('button.comment.post:first');
    andThen(function() {
      expect(find('button.comment.post:first').length).to.eql(0);
    });
  });
});
