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
	describe('home page', function() {
		var fixture = __fixture('postGET');
		beforeEach(function() {
		 	this.server.respondWith(fixture.request.method, fixture.request.url,
		 		[200, { 'Content-Type': 'application/json' },
		 		 JSON.stringify(fixture.response.json)]); 
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

	describe('post on create', function() {
		beforeEach(function() {
			visit('/create');
		});
		it('will have created a post on index page', function() {
			fillIn('textarea.content.post', 'HELLO WORLD!');

			// before clicking create, we should set up to fake the
			// POST /api/posts
			var fixture = __fixture('postPOST');
			this.server.respondWith(fixture.request.method, fixture.request.url,
		 		[200, { 'Content-Type': 'application/json' },
		 		 JSON.stringify(fixture.response.json)]);

			var getFixture = __fixture('postGET');
			this.server.respondWith(getFixture.request.method, getFixture.request.url,
		 		[200, { 'Content-Type': 'application/json' },
		 		 JSON.stringify(getFixture.response.json)]);

			click('button.create.post');
			andThen(function() { 
				this.server.requests.forEach(function(request) {
					console.log(request);
				});
				expect(this.server.requests.length).to.eql(3);
				expect(this.server.requests[0].method).to.eql(fixture.request.method);
				expect(this.server.requests[0].url).to.eql(fixture.request.url);
				// expect(this.server.requests[0].requestHeaders).to.contain(fixture.request.headers);
	   //    expect(JSON.parse(this.server.requests[0].requestBody)).to.eql(fixture.request.json);
			}.bind(this));
			// - check to see that one request was made to the fake server.
			// - check to see that the one request that was made was the
			//   fake one we set up before?
			// - check all this (by looking at this.server.requests[n]):
			// server expectations for POST /api/posts
			//   auhorization token must be present
			//   json content must be present with:
			//     post object with:
			//       content
			//       other properties can be present and are ignored
			//     other proerties can be present and are ignored

			andThen(function() { expect(currentRouteName()).to.eql('index'); });
			andThen(function() {
				expect(find('ul.content li:first').text()).to
				.eql('HELLO WORLD!');
				expect(find('h6.timestamp:first').text()).to.eql('Tue Jul 15 2014 10:35:31 GMT-0700 (PDT)');
			});
		});
	});
});
