'use strict';

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
			andThen(function() { click('button.create.post'); });
			andThen(function() { expect(currentRouteName()).to.eql('index'); });
			andThen(function() {
				expect(find('ul.content li:first').text()).to
				.eql('HELLO WORLD!');
			});
		});
	});
});
