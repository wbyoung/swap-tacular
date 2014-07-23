  describe('home page', function() {
    var fixture = __fixture('post/postsGET');
    beforeEach(function() {
      sendFakeRequest(this.server, 'post/postsGET');
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
