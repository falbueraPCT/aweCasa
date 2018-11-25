var map, infoWindow;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), { center: {lat: -34.397, lng: 150.644}, zoom: 14 });

    infoWindow = new google.maps.InfoWindow;

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
            
            pos = { lat: position.coords.latitude, lng: position.coords.longitude };
            awe.povs.update({ data: { position: { x: pos.lat * 10000, y: 0, z: pos.lng * 10000 } }, where: { id: 'default' } });
            console.log('POS LAT --> ' + pos.lat);
            console.log('POS LNG --> ' + pos.lng);            
            infoWindow.setPosition(pos);
            infoWindow.setContent('Ubicació trobada!');
            infoWindow.open(map);
            map.setCenter(pos); 
        });
        
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}