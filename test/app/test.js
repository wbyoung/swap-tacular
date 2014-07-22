'use strict';

describe('app', function() {
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

	var sendFakeRequest = function(fakeServer, fixtureURL) {
		var fixture = __fixture(fixtureURL);
		fakeServer.respondWith(fixture.request.method, fixture.request.url,
		 		[200, { 'Content-Type': 'application/json' },
		 		 JSON.stringify(fixture.response.json)]); 
	};

	describe('home page', function() {
		var fixture = __fixture('postsGET');
		beforeEach(function() {
			sendFakeRequest(this.server, 'postsGET');
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

	describe('create page', function() {
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

	describe('shows user\'s own post on profile page', function() {
		beforeEach(function() {
			sendFakeRequest(this.server, 'postGETUser');
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
					expect(find('button.edit.post:first').text()).to.eql('Edit');
					expect(find('button.edit.post')).to.exist;
				});
			});
		});
	});

	describe('shows post page by sending single query request', function() {
		beforeEach(function() {
			sendFakeRequest(this.server, 'postGET');
			visit('/post/12');
		});
		it('will have one single post', function() {
			expect(currentRouteName()).to.eql('post');
			expect(find('ul.message:first li').text()).to.eql('I\'m really excited about using this new Swap service!');
			expect(find('button.edit.post:first').text()).to.eql('Edit');
			expect(find('button.edit.post')).to.exist;
		});
	});
	
	describe('edits posts', function() {
		beforeEach(function() {
			sendFakeRequest(this.server, 'postGETUser');
			visit('/profile');
		});
		it('is on the profile page', function() {
			expect(currentRouteName()).to.eql('profile');
		});
	});

	describe('deletes posts', function() {
		
	});

	describe('orders posts in descending order', function() {
		beforeEach(function() {
			sendFakeRequest(this.server, 'postOrder');
			visit('/');
		});
		it('will order posts by date', function() {
			expect(currentRouteName()).to.eql('index');
			expect(find('ul.message:first li').text()).to.eql('This should be first');
			expect(find('ul.message:nth-of-type(2) li').text()).to.eql('This should be second');
			expect(find('ul.message:last li').text()).to.eql('This should be last');
		});

	});

	describe('post on create', function() {
		beforeEach(function() {
			visit('/create');
		});
		it('will have created a post on index page', function() {
			fillIn('textarea.message.post', 'HELLO WORLD!');
			var fixture = __fixture('postPOST');
			var self = this;
			sendFakeRequest(this.server, 'postPOST');
			sendFakeRequest(this.server, 'postsGET');
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
						expect(currentRouteName()).to.eql('post');
						expect(find('button.edit.post')).to.exist;
						click('button.edit.post');
						fillIn('textarea.edit.post', 'HELLO!');
						// var fixture = __fixture('postPUT');
						sendFakeRequest(self.server, 'postPUT');
						click('button.edit.done');
						andThen(function() {
							expect(self.server.requests.length).to.eql(3);
							expect(find('ul.message li:first').text()).to.eql('HELLO!');
						});
					});
			});
		});
	});

	describe('comments on post', function() {
		beforeEach(function() {
			sendFakeRequest(this.server, 'postsGET');
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
			click('button.comment.post:first');
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
});
