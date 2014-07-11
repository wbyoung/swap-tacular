'use strict';

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
