
var mapa = { 
    mapaTgnTe: { 
        map: null, 
        geodesic: true,  
        overlay: { 
            markerUser: null,
            markerPOI1: null, 
            markerPOI2: null,            
            path: null
        } 
    } 
};   

function initMap() {    
    
    var mapaOpcions = { 
            zoom: 0,
            center: new google.maps.LatLng(0, 0),
            mapTypeId: google.maps.MapTypeId.HYBRID,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            },
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL,
            },
            streetViewControl: false,
            scaleControl: true
    };

    mapa.mapaTgnTe.map = new google.maps.Map(document.getElementById('map'), mapaOpcions);

    if (navigator.geolocation) {
        
       var watchID = navigator.geolocation.watchPosition(function(position) {
            pos = { lat: position.coords.latitude, lng: position.coords.longitude };
            drawPath(pos.lat, pos.lng, poi1_lat, poi1_lng, poi2_lat, poi2_lng, mapa.mapaTgnTe);            
        });
        
    } else {
        // Browser doesn't support Geolocation
        console.log('Browser no support Geolocation');
        //handleLocationError(false, infoWindow, map.getCenter());
    }
}

/*
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}
*/
    


function drawPath(lat1User, lon1User, latPOI1, lonPOI1, latPOI2, lonPOI2, m) {
    
    google.maps.event.trigger(m.map, 'resize');
    
    if (m.overlay.markerUser) { m.overlay.markerUser.setMap(null); m.overlay.markerUser = null; }
    if (m.overlay.markerPOI1) { m.overlay.markerPOI1.setMap(null); m.overlay.markerPOI1 = null; }
    if (m.overlay.markerPOI2) { m.overlay.markerPOI2.setMap(null); m.overlay.markerPOI2 = null; }
    
    if (m.overlay.path)    { m.overlay.path.setMap(null);    m.overlay.path = null; }

    if (!isNaN(lat1User+lon1User+latPOI1+lonPOI1+latPOI2+lonPOI2)) {
        
        var pUser = new google.maps.LatLng(lat1User, lon1User);
        var pPOI1 = new google.maps.LatLng(latPOI1, lonPOI1);        
        
        var sw = new google.maps.LatLng(Math.min(lat1User, latPOI1), Math.min(lon1User, lonPOI1));
        var ne = new google.maps.LatLng(Math.max(lat1User, latPOI1), Math.max(lon1User, lonPOI1));
        
        var bnds = new google.maps.LatLngBounds(sw, ne);
        
        m.map.fitBounds(bnds);
        
        m.overlay.markerUser = new google.maps.Marker({ map:m.map, position:pUser, title:'Estàs aquí!', icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png' });
        m.overlay.markerPOI1 = new google.maps.Marker({ map:m.map, position:pPOI1, title:'POI1!', icon:'http://maps.google.com/mapfiles/ms/icons/red.png' });
        m.overlay.path = new google.maps.Polyline({ map:m.map, path:[pUser, pPOI1], strokeColor:'#990000', geodesic:m.geodesic});
        
        var pPOI2 = new google.maps.LatLng(latPOI2, lonPOI2);
        sw = new google.maps.LatLng(Math.min(lat1User, latPOI2), Math.min(lon1User, lonPOI2));
        ne = new google.maps.LatLng(Math.max(lat1User, latPOI2), Math.max(lon1User, lonPOI2));
        
        bnds = new google.maps.LatLngBounds(sw, ne);
        
        m.map.fitBounds(bnds);       
        
        m.overlay.markerPOI2 = new google.maps.Marker({ map:m.map, position:pPOI2, title:'POI2!', icon:'http://maps.google.com/mapfiles/ms/icons/red.png' });
        m.overlay.path = new google.maps.Polyline({ map:m.map, path:[pUser, pPOI2], strokeColor:'#990000', geodesic:m.geodesic});
        
    }
}