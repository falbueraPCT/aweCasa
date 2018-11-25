var map, infoWindow;

function initMap() {
    
    map = new google.maps.Map(document.getElementById('map'), { center: {lat: -34.397, lng: 150.644}, zoom: 14 });

    infoWindow = new google.maps.InfoWindow;
    
    var doc = document; doc.qrySel = doc.querySelector; doc.qrySelAll = doc.querySelectorAll; // shorthand

    var maps = { orthoDist: { map:null, geodesic:true,  overlay: { marker1:null, marker2:null, path:null } } };

    Dms.separator = '\u202f';
    var degFmt = 'dms';     
        
    var mapOptions = {
        zoom: 0,
        center: new google.maps.LatLng(0, 0),
        mapTypeId: google.maps.MapTypeId.HYBRID, mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU, }, navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL, }, streetViewControl: false, scaleControl: true, };
     
    maps.orthoDist.map = new google.maps.Map(doc.qrySel('#map-ortho-dist-canvas'), mapOptions);

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        
        /*
        navigator.geolocation.getCurrentPosition(function(position) {                    
            var pos = { lat: position.coords.latitude, lng: position.coords.longitude };
            console.log('POS LAT --> ' + pos.lat);
            console.log('POS LNG --> ' + pos.lng);            
            infoWindow.setPosition(pos);
            infoWindow.setContent('Ubicació trobada!');
            infoWindow.open(map);
            map.setCenter(pos);                    
        }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
        });
        */
    var watchID = navigator.geolocation.watchPosition(function(position) {
            
        new_place = true;
            
        userPos = { lat: position.coords.latitude, lng: position.coords.longitude };
        console.log('POS LAT --> ' + userPos.lat);
        console.log('POS LNG --> ' + userPos.lng);            
        infoWindow.setPosition(userPos);
        infoWindow.setContent('Ubicació trobada!');
        infoWindow.open(map);
        map.setCenter(userPos); 
            
        var lat1 = Dms.parseDMS(userPos.lat);
        var lon1 = Dms.parseDMS(userPos.lng);
        var lat2 = Dms.parseDMS(40.705393);
        var lon2 = Dms.parseDMS(0.583674);

        // calculate distance, bearing, mid-point
        var p1 = LatLon(lat1, lon1);
        var p2 = LatLon(lat2, lon2);
        var dist = p1.distanceTo(p2);
        var brng1 = p1.bearingTo(p2);
        var brng2 = p1.finalBearingTo(p2);
        var pMid = p1.midpointTo(p2);

        drawPath(p1.lat, p1.lon, p2.lat, p2.lon, maps.orthoDist);           
        
    });
        
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
 


        function drawPath(lat1, lon1, lat2, lon2, m) {
            google.maps.event.trigger(m.map, 'resize');  // Gaaaaaah!

            // clear current overlays
            if (m.overlay.marker1) { m.overlay.marker1.setMap(null); m.overlay.marker1 = null; }
            if (m.overlay.marker2) { m.overlay.marker2.setMap(null); m.overlay.marker1 = null; }
            if (m.overlay.path)    { m.overlay.path.setMap(null);    m.overlay.path = null; }

            // if supplied lat/long are all valid numbers, draw the path
            if (!isNaN(lat1+lon1+lat2+lon2)) {
                var p1 = new google.maps.LatLng(lat1, lon1);
                var p2 = new google.maps.LatLng(lat2, lon2);
                var sw = new google.maps.LatLng(Math.min(lat1, lat2), Math.min(lon1, lon2));
                var ne = new google.maps.LatLng(Math.max(lat1, lat2), Math.max(lon1, lon2));
                var bnds = new google.maps.LatLngBounds(sw, ne);
                m.map.fitBounds(bnds);
                m.overlay.marker1 = new google.maps.Marker({ map:m.map, position:p1, title:'Point 1', icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png' });
                m.overlay.marker2 = new google.maps.Marker({ map:m.map, position:p2, title:'Point 2', icon:'http://maps.google.com/mapfiles/ms/icons/red.png' });
                m.overlay.path = new google.maps.Polyline({ map:m.map, path:[p1, p2], strokeColor:'#990000', geodesic:m.geodesic});
            }
        }   
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}