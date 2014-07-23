  
  describe('edits posts', function() {
    beforeEach(function() {
      sendFakeRequest(this.server, 'post/postGETUser');
      visit('/profile');
    });
    it('is on the profile page', function() {
      expect(currentRouteName()).to.eql('profile');
    });
  });
  describe('orders posts in descending order', function() {
    beforeEach(function() {
      sendFakeRequest(this.server, 'post/postOrder');
      visit('/');
    });
    it('will order posts by date', function() {
      expect(currentRouteName()).to.eql('index');
      expect(find('ul.message:first li').text()).to.eql('This should be first');
      expect(find('ul.message:nth-of-type(2) li').text()).to.eql('This should be second');
      expect(find('ul.message:last li').text()).to.eql('This should be last');
    });
  });
