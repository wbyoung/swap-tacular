'use strict';

describe('shows user\'s own post on profile page', function() {
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
  it('will have all the posts by Tian', function() {
    expect(currentRouteName()).to.eql('profile');
    expect(find('h1.user:first').text()).to.eql('fake-username\'s profile page.');
    expect(find('ul.message:first li').text()).to.eql('This should be first');
    expect(find('ul.message:last li').text()).to.eql('This should be last');
  });
  it('can click on link to one post', function() {
    click('ul.message:first li a');
    andThen(function() {
      expect(currentRouteName()).to.eql('post');
      it('has an edit button', function() {
        expect(find('ul.message:first li').text()).to.eql('This should be first');
        expect(find('button.edit.post')).to.exist;
        expect(find('button.edit.post:first').text()).to.eql('Edit');
      });
    });
  });
  it('deletes the post', function() {
    __sendFakeRequest(this.server, 'post/postDELETE');
    click('ul.message:first li a');
    andThen(function() {
      expect(find('ul.message:first li').text()).to.eql('This should be first');
      expect(currentRouteName()).to.eql('post');
      it('has an delete button', function() {
        expect(find('button.delete.post:first').text()).to.eql('Delete');
      });
      click('button.delete.post:first');
      andThen(function() {
        //TODO: Expectations and changing fixture data?
      });
    });
  });
});
