'use strict';

describe('app', function() {
  afterEach(function() {
    App.reset();
  });
  
  it('will have a creat post page', function() {
    visit('/create');
    andThen(function () {
      expect(currentRouteName()).to.eql('create');
    });
  });
});
