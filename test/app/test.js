'use strict';

describe('app', function() {
	beforeEach(function() {
		this.server = sinon.fakeServer.create();
		this.server.autoRespond = true;

		var container = applicationContainer();
		var session = container.lookup('auth-session:main');
		session.set('content', {
		  username: 'fake-username',
		  token: 'fake-token'
		});
	});
	afterEach(function() {				
		this.server.restore();
		App.reset();
	});

	var sendFakeRequest = function(fakeServer, fixtureURL) {
		var fixture = __fixture(fixtureURL);
		fakeServer.respondWith(fixture.request.method, fixture.request.url,
		 		[200, { 'Content-Type': 'application/json' },
		 		 JSON.stringify(fixture.response.json)]); 
	};

	describe('home page', function() {
		var fixture = __fixture('postGET');
		beforeEach(function() {
			sendFakeRequest(this.server, 'postGET');
			visit('/');
		});
		it('is on home page', function() {
			expect(currentRouteName()).to.eql('index');
		});
		it('shows posts from users', function() {
			expect(find('ul.content li:first').text()).to
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

	describe('create page', function() {
		beforeEach(function() {
			visit('/create');
		});
		it('will have a create post page', function() {
      expect(currentRouteName()).to.eql('create');
  	});
	  it('will have a create button', function() {
	    expect(find('button.create.post').length).to.eql(1);
	  });
	  it('will have an textarea box', function() {
	    expect(find('textarea.content.post').length).to.eql(1);
	  });
	});  

	describe('shows user\'s own post on profile page', function () {
		beforeEach(function() {
			sendFakeRequest(this.server, 'postOrder');
			visit('/profile');
		});
		it.skip('will have all the posts by fake-username', function() {
			expect(currentRouteName()).to.eql('profile');
			expect(find('h3.user:first').text()).to.eql('fake-username');
			expect(find('h3.user:last').text()).to.eql('fake-username');
			expect(find('ul.content:first li').text()).to.eql('This should be first');
			expect(find('ul.content:last li').text()).to.eql('This should be second');
		});
	});

	describe('edits posts', function () {
		var fixture = __fixture('postGET');
		beforeEach(function() {
			sendFakeRequest(this.server, 'postGET');
			visit('/profile');
		});
		it('is on the profile page', function() {
			expect(currentRouteName()).to.eql('profile');
		});
		it('has an edit button', function() {
			expect(find('button.edit.post').length).to.eql(1);
		});
	});
	describe('deletes posts', function() {
		
	});

	describe('orders posts in descending order', function() {
		beforeEach(function() {
			sendFakeRequest(this.server, 'postOrder');
			visit('/');
		});
		it.skip('will order posts by date', function() {
			expect(currentRouteName()).to.eql('index');
			expect(find('ul.content:first li').text()).to.eql('This should be first');
			expect(find('ul.content:nth-of-type(2) li').text()).to.eql('This should be second');
			expect(find('ul.content:last li').text()).to.eql('This should be last');
		});

	});

	describe('post on create', function() {
		beforeEach(function() {
			visit('/create');
		});
		it('will have created a post on index page', function() {
			fillIn('textarea.content.post', 'HELLO WORLD!');
			var fixture = __fixture('postPOST');
			sendFakeRequest(this.server, 'postPOST');
			sendFakeRequest(this.server, 'postGET');
			click('button.create.post');
			andThen(function() { 
				expect(this.server.requests.length).to.eql(2);
				expect(this.server.requests[0].method).to.eql(fixture.request.method);
				expect(this.server.requests[0].url).to.eql(fixture.request.url);
			}.bind(this));
			andThen(function() { expect(currentRouteName()).to.eql('index'); });
			andThen(function() {
				expect(find('ul.content li:first').text()).to
				.eql('HELLO WORLD!');
				var dateString = new Date(fixture.response.json.post.createdAt).toString();
				expect(find('h6.timestamp:first').text()).to.eql(dateString);
			});
		});
	});
});
