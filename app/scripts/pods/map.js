'use strict';

module.exports = function(App) {

  App.MapView = Ember.ContainerView.extend({

    id: 'map-canvas',
    tagName: 'div',

    attributeBindings: ['style'],
    style:'height: 500px; width: 500px',
    
    map:null,

    didInsertElement: function() {
      var mapOptions = {
        center: new google.maps.LatLng(45.5328920, -122.6892510),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(this.$().get(0),mapOptions);
      this.set('map',map);
     
      var marker = new google.maps.Marker({
        position: mapOptions.center,
        title:'Hello World!'
      });

      marker.setMap(map);
    }
  });
};


