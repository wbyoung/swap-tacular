  describe('comments on post', function() {
    beforeEach(function() {
      sendFakeRequest(this.server, 'post/postsGET');
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
