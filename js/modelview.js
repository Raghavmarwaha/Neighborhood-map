//uses the map stylers
var styles = [{
        "elementType": "geometry",
        "stylers": [{
            "color": "#242f3e"
        }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#746855"
        }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#242f3e"
        }]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#d59563"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#d59563"
        }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
            "color": "#263c3f"
        }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#6b9a76"
        }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
            "color": "#38414e"
        }]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#212a37"
        }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#9ca5b3"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
            "color": "#746855"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#1f2835"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#f3d19c"
        }]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{
            "color": "#2f3948"
        }]
    },
    {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#d59563"
        }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#17263c"
        }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#515c6d"
        }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#17263c"
        }]
    }
];
//here when we click the heading its color changes from black to orange and box shadow appears
function events() {
    document.getElementById("changes").style.boxShadow = "10px 10px 10px lightblue";
    document.getElementById("changes").style.color = "orange";
}
var map;

// this function loads the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {

        center: {
            lat: 31.6379,
            lng: 74.8787
        },
        zoom: 13,
        styles: styles
    });
    // here we apply the knockout
    ko.applyBindings(new mygetplaces());

}

//if net is not working properly,this error shows which you see below
function googerror() {
    document.getElementById('map').innerHTML = "Map not working,extremely sorry!!";
}

// here infowindow appear each time when you click the marker
function mygetplaces() {
    var self = this;
    var infowindow = new google.maps.InfoWindow();

    self.errmssg = ko.observable();
    self.searchplaces = ko.observable();
    self.arr = [];


    for (var i = 0; i < markers.length; i++) {
        var marker = new google.maps.Marker({
            position: markers[i].location,
            map: map,
            name: markers[i].name,
            ids: markers[i].id,
            show: ko.observable(markers[i].show),
            animation: google.maps.Animation.DROP

        });
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');


        //markers are getting pushed into an array
        self.arr.push(marker);


        console.log(self.arr[i].name);
        //when you mouse over the html element its color changes from green to blue
        marker.addListener('mouseover', function() {
            this.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
            infowindow.open(map, this);
            infowindow.setContent("<div>" + "click to get info about this location" + "</div>");
        });

        marker.addListener('mouseout', function() {
            infowindow.close();
            this.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        });
        marker.addListener('click',function() {
          infowindow.open(map, self.arr[i]);
          arrWindow(this);
          graphics(this);
      });

    }

    for (i = 0; i < self.arr.length; i++) {
        google.maps.event.addListener(self.arr[i], 'click', function() {

            infowindow.open(map, this);
            arrWindow(this);
            graphics(this);
        });

    }

    console.log(self.arr.length);

    //clicking the items listed.
    self.myselection = function() {
        for (var i = 0; i < self.arr.length; i++) {

            if (this.name === markers[i].name) {


                infowindow.open(map, self.arr[i]);
                arrWindow(this);
                infowindow.setContent("<div>" + this.name + " Selected" + "</div>");

                graphics(this);
            }
        }
    };

    //Ajax api used to retreive data.
    arrWindow = function(mark) {
        $.ajax({
            url: "https://api.foursquare.com/v2/venues/" + mark.ids + "?client_id=EOXJWIHNDTJLAZR3YBIQXOPXKILJC4PTVJACUTCCI00IYI2C&client_secret=HGFRQY1DEZXIYNGPRSIQJRUKYRS42TZYLX11ACRA5XNBWXYB&v=20170410",
            dataType: "json",

            success: function(d) {

                if (d.response.venue.hasOwnProperty('likes')) {
                    mark.likes = d.response.venue.likes.summary;
                }
                if (d.response.venue.hasOwnProperty('rating')) {
                    mark.rating = d.response.venue.rating;
                }
                infowindow.setContent("<h3>" + mark.name + "</h3>" + "<div>" + mark.likes + "</div>" + "<div>" + "Rating- " + mark.rating + "</div>");
            },
            error: function() {
                infowindow.setContent("<div>" + "something has gone wrong while fetching data" + "</div>");
            }
        });


    };
    //filter search applied.
    searchbar = function() {
        infowindow.close();
        if (self.searchplaces().length ===0) {
            for (var i = 0; i < self.arr.length; i++) {
                self.arr[i].setVisible(true);
                self.arr[i].show(true);
            }
        } else {
            if (self.searchplaces().length >= 1) {
                for (var i = 0; i < self.arr.length; i++) {

                    if (self.arr[i].name.toLowerCase().indexOf(self.searchplaces().toLowerCase()) >= 0) {
                        self.arr[i].show(true);
                        self.arr[i].setVisible(true);
                    } else {
                        self.arr[i].setVisible(false);
                        self.arr[i].show(false);
                    }
                }
            }
        }
    };
    //marker animations
    graphics = function(marking) {
        marking.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marking.setAnimation(null);
        }, 1500);

    };
}
