 'use strict';
 window.App = Ember.Application.create();
 
    App.MapWithCoordinatesView = Ember.View.extend({
      templateName: "map-with-coordinates"
    });
    
    App.MapView = Ember.View.extend({
      didInsertElement: function() {
        // this is required for the map to be rendered
        this.$().css({ width: "500px", height: "200px" });
        // create the LatLng object that will be used to center both the map and the marker
        var center = new google.maps.LatLng(this.get("latitude"),this.get("longitude"));
        // some options
        var options = {
          disableDefaultUI: true,
          center: center,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // create the map
        var map = new google.maps.Map(this.$()[0], options);
        // create the marker
        var marker = new google.maps.Marker({ position: center, map: map, draggable: true });
        // save them both for later use
        this.set("marker", marker);
        this.set("map", map);
        var that = this;
        // add a listener on the "drag" event of the marker
        google.maps.event.addListener(marker, "drag", function() {
          // retrieve the current position of the marker
          var position = marker.getPosition();
          // update the latitude/longitude properties
          that.setProperties({
            latitude: position.lat(),
            longitude: position.lng()
          });
        });
        // listeners used to know when we're dragging
        google.maps.event.addListener(marker, "dragstart", function() { that.set("dragging", true); });
        google.maps.event.addListener(marker, "dragend", function() { that.set("dragging", false); });
      },
      
      willDestroyElement: function() {
        // make sure we clear all listeners
        google.maps.event.clearInstanceListeners(this.get("marker"));
      },
      
      coordinatesChanged: function() {
        // create a new position object from the marker's position
        var position = new google.maps.LatLng(this.get("latitude"), this.get("longitude"));
        // only center the map when the position has been changed by changing the textfields
        if (!this.get("dragging")) { this.get("map").setCenter(position); }
        // update the position of the marker
        this.get("marker").setPosition(position);
      }.observes("latitude", "longitude")
    });

   