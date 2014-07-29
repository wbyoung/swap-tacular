'use strict';

module.exports = function(App) {

App.Marker = Ember.Object.extend({
});

App.MapView = Ember.View.extend({
  id: 'map_canvas',
  tagName: 'div',

  attributeBindings: ['style'],
  style:'width:100%; height:400px',
  
  map:null,

  markers:[],
  
  didInsertElement: function() {
    var mapOptions = {
      center: new google.maps.LatLng(45.5328920, -122.6892510),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var controller = this.get('controller');
    var map = new google.maps.Map(this.$().get(0),mapOptions);
    
    this.set('map',map);
    
    var that = this;

    google.maps.event.addListener(map, 'click', function(event){
      var marker = new google.maps.Marker({
        position: event.latLng,
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        animation: google.maps.Animation.DROP
      });

      // create a new marker object containing the lat,lng and the googleMarker
      var markerObject = App.Marker.create({
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng(),
                            googleMarker: marker
      });

      markerObject.set("selected",true);

      // store the google marker object on this view. 
      that.get("markers").pushObject(marker);

      // Instruct the controller that the marker was added.
      controller.addMarker(markerObject);

      google.maps.event.addListener(marker, 'click', function() {
        controller.markerClick(markerObject);
      });

      marker.setMap(that.get("map"));
      
    });
  }
});


App.CreateController = Ember.ArrayController.extend({
  content: [],
  
  // We add the markr to the ArrayControllers content.
  addMarker: function (marker) {
    this.content.pushObject(marker);
  },

  // When clicking on a marker, we toggle the selected state.  
  markerClick: function(marker) {
    marker.set("selected",!marker.get("selected"));
  },


  // This property simply displays the number of selected markers.
  selectedMarkerCounter: function () {
    return this.filterProperty('selected', true).get('length');
  }.property('@each.selected'),


  removeSelectedMarkers: function() {
    arr = this.filterProperty('selected', true);
    if (arr.length==0) {
        output = "nothing selected";
    } else { 
        output = "";

        var toBeRemoved = [];

        for (var i = arr.length -1; i >= 0; i--) {
            toBeRemoved.push(arr[i]);
        }

        for (var i = toBeRemoved.length -1; i >= 0; i--) {
          toBeRemoved[i].googleMarker.setMap(null);
          this.content.removeObject(toBeRemoved[i]);
        }

    }
  },

  highLightSelectedMarkers: function() {

    $.each(this.content, function (i, m) {
        m.set("selected",false);
    });

    if (this.content.length>0) {
      this.content[this.content.length-1].set("selected",true);
    }

  }.observes('content.@each')
});

// we need to have an item-controller in place.... the selected property is stored on this controller 
// this controller simply observes the selected property to set the appropriate icon.
App.MarkerController = Ember.ObjectController.extend({
    markerIcon: function() {
        if (this.get("selected")) {
          this.content.googleMarker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
        } else {
          this.content.googleMarker.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
        }
    }.observes("selected")
});
};


