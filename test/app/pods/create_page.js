
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
