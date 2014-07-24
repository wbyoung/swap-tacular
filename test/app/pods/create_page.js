'use strict';

describe('create page', function() {
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
    visit('/create');
  });
  it('will have a create post page', function() {
    expect(currentRouteName()).to.eql('create');
  });
  it('will have a create button', function() {
    expect(find('button.create.post').length).to.eql(1);
    expect(find('button.create.post').text()).to.eql('Add');
  });
  it('will have an textarea box', function() {
    expect(find('textarea.message.post').length).to.eql(1);
  });
});
