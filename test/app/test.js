'use strict';
var fixture = __fixture('postGET');
describe('app', function() {
  afterEach(function() {
    App.reset();
  });
  
  it.skip('will have a create post page', function() {
    visit('/create');
    andThen(function () {
      expect(currentRouteName()).to.eql('create');
    });
  });
  it.skip('will have a create button', function() {
    visit('/create');
    andThen(function () {
      expect(find('button.create.post').length).to.eql(1);
    });
  });
  it('will have an input box', function() {
    visit('/create');
    andThen(function () {
      expect(find('input[type="text"].content.post').length).to.eql(1);
    });
  });
});
describe('app', function() {
	before(function () {
		this.server = sinon.fakeServer.create();
		this.server.autoRespond = true;
	});
	after(function () { this.server.restore(); });

	beforeEach(function() {
		var container = applicationContainer();
		var session = container.lookup('auth-session:main');
		session.set('content', {
		  username: 'fake-username',
		  token: 'fake-token'
		});
	});
	afterEach(function() {
		App.reset();
	});
	describe('profile page', function() {
		beforeEach(function() {
		 	this.server.respondWith(fixture.request.method, fixture.request.url,
		 		[200, { 'Content-Type': 'application/json' },
		 		 JSON.stringify(fixture.response.json)]); 
			visit('profile');
		});
		it('is on profile page', function() {
			expect(currentRouteName()).to.eql('profile');
		});
		it('shows posts from current user', function() {
			expect(find('ul.postContent li:first').text()).to
			.eql('I\'m really excited about using this new Swap service!');
		});
	});
});
