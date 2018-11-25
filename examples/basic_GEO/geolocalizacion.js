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
            
            userPos = { lat: position.coords.latitude, lng: position.coords.longitude };
            //awe.povs.update({ data: { position: { x: pos.lat * 10000, y: 0, z: pos.lng * 10000 } }, where: { id: 'default' } });
            console.log('POS LAT --> ' + userPos.lat);
            console.log('POS LNG --> ' + userPos.lng);            
            infoWindow.setPosition(userPos);
            infoWindow.setContent('Ubicació trobada!');
            infoWindow.open(map);
            map.setCenter(userPos); 
        });
        
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

        //***************************************************************
        var doc = document; doc.qrySel = doc.querySelector; doc.qrySelAll = doc.querySelectorAll; // shorthand

        var maps = { // note we have to track overlay items ourselves
            orthoDist: { map:null, geodesic:true,  overlay: { marker1:null, marker2:null, path:null } },
            orthoDest: { map:null, geodesic:true,  overlay: { marker1:null, marker2:null, path:null } },
            rhumbDist: { map:null, geodesic:false, overlay: { marker1:null, marker2:null, path:null } },
            rhumbDest: { map:null, geodesic:false, overlay: { marker1:null, marker2:null, path:null } }
        };

        //document.addEventListener('DOMContentLoaded', function(event) {
            Dms.separator = '\u202f'; // narrow no-break space

            // has user made d/dms display preference?
            //var degFmt = Cookies.get('latlon-degree-format') || 'dms';
            var degFmt = 'dms';
            // show current preference
            //doc.qrySel('#deg-format-'+degFmt).checked = true;

            // initialise maps
            var mapOptions = {
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
                scaleControl: true,
            };
            maps.orthoDist.map = new google.maps.Map(doc.qrySel('#map-ortho-dist-canvas'), mapOptions);
            //maps.orthoDest.map = new google.maps.Map(doc.qrySel('#map-ortho-dest-canvas'), mapOptions);
            //maps.rhumbDist.map = new google.maps.Map(doc.qrySel('#map-rhumb-dist-canvas'), mapOptions);
            //maps.rhumbDest.map = new google.maps.Map(doc.qrySel('#map-rhumb-dest-canvas'), mapOptions);

            // ---- listeners for orthodrome distance / bearings / midpoint between two points

            // listener for updated values
            //$('#ortho-dist input').change( function() {
            /*
                var lat1 = Dms.parseDMS($('#ortho-dist .lat1').val());
                var lon1 = Dms.parseDMS($('#ortho-dist .lon1').val());
                var lat2 = Dms.parseDMS($('#ortho-dist .lat2').val());
                var lon2 = Dms.parseDMS($('#ortho-dist .lon2').val());
            */    
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

                // display results
               // var d = (dist/1000).toPrecision(4); // in km rounded to 4 significant figures
               // $('#ortho-dist .result-dist').html(d>1 ? Number(d) : d); // avoid exponential notation
               // $('#ortho-dist .result-brng1').html(Dms.toBrng(brng1, degFmt));
               // $('#ortho-dist .result-brng2').html(Dms.toBrng(brng2, degFmt));
              //  $('#ortho-dist .result-midpt').html(pMid.toString(degFmt));

                // show path on map
                //if ($('#map-ortho-dist-canvas').is(':visible')) {
                    drawPath(p1.lat, p1.lon, p2.lat, p2.lon, maps.orthoDist);
               // }
            //});
            
            /*
            $('#ortho-dist .lat1').trigger('change'); // initial calculation

            // listener for map toggle
            $('#ortho-dist .toggle-map a').click( function() {
                $('#ortho-dist .toggle-map').toggle(); // 'see on map' text
                $('#ortho-dist .map').toggle();        // the map itself

                $('#ortho-dist .lat1').trigger('change'); // to invoke drawPath()
            });

            // ---- listeners for orthodrome destination point from start point / bearing / distance

            // listener for updated values
            $('#ortho-dest input').change( function() {
                var lat1 = Dms.parseDMS($('#ortho-dest .lat1').val());
                var lon1 = Dms.parseDMS($('#ortho-dest .lon1').val());
                var dist = $('#ortho-dest .dist').val() * 1000; // convert km to metres
                var brng = Dms.parseDMS($('#ortho-dest .brng').val());

                // calculate destination point, final bearing
                var p1 = LatLon(lat1, lon1);
                var p2 = p1.destinationPoint(dist, brng);
                var brngFinal = p1.finalBearingTo(p2);

                // display results
                $('#ortho-dest .result-point').html(p2.toString(degFmt));
                $('#ortho-dest .result-brng').html(Dms.toBrng(brngFinal,degFmt));

                // show path on map
                if ($('#map-ortho-dest-canvas').is(':visible')) {
                    drawPath(p1.lat, p1.lon, p2.lat, p2.lon, maps.orthoDest);
                }
            });
            $('#ortho-dest .lat1').trigger('change'); // initial calculation

            // listener for map toggle
            $('#ortho-dest .toggle-map a').click( function() {
                $('#ortho-dest .toggle-map').toggle();
                $('#ortho-dest .map').toggle();

                $('#ortho-dest .lat1').trigger('change'); // to invoke drawPath()
            });

            // ---- listeners for intersection of two paths

            // listener for updated values
            $('#intersect input').change( function() {
                var lat1 = Dms.parseDMS($('#intersect .lat1').val());
                var lon1 = Dms.parseDMS($('#intersect .lon1').val());
                var lat2 = Dms.parseDMS($('#intersect .lat2').val());
                var lon2 = Dms.parseDMS($('#intersect .lon2').val());

                // calculate intersection point
                var p1 = LatLon(lat1, lon1);
                var p2 = LatLon(lat2, lon2);
                var brng1 = Dms.parseDMS($('#intersect .brng1').val());
                var brng2 = Dms.parseDMS($('#intersect .brng2').val());
                var pInt = LatLon.intersection(p1, brng1, p2, brng2);

                // display result
                $('#intersect .result-point').html(pInt==null ? '[ambiguous]' : pInt.toString(degFmt));
            });
            $('#intersect .lat1').trigger('change'); // initial calculation

            // ---- listeners for rhumb lines distance

            // listener for updated values
            $('#rhumb-dist input').change( function() {
                var lat1 = Dms.parseDMS($('#rhumb-dist .lat1').val());
                var lon1 = Dms.parseDMS($('#rhumb-dist .lon1').val());
                var lat2 = Dms.parseDMS($('#rhumb-dist .lat2').val());
                var lon2 = Dms.parseDMS($('#rhumb-dist .lon2').val());

                // calculate distance, bearing, mid-point
                var p1 = LatLon(lat1, lon1);
                var p2 = LatLon(lat2, lon2);
                var dist = p1.rhumbDistanceTo(p2);
                var brng = p1.rhumbBearingTo(p2);
                var pMid = p1.rhumbMidpointTo(p2);

                // display results
                var d = (dist/1000).toPrecision(4); // in km rounded to 4 significant figures
                $('#rhumb-dist .result-dist').html(d>1 ? Number(d) : d); // avoid exponential notation
                $('#rhumb-dist .result-brng').html(Dms.toBrng(brng, degFmt));
                $('#rhumb-dist .result-midpt').html(pMid.toString(degFmt));

                // show path on map
                if ($('#map-rhumb-dist-canvas').is(':visible')) {
                    drawPath(p1.lat, p1.lon, p2.lat, p2.lon, maps.rhumbDist);
                }
            });
            $('#rhumb-dist .lat1').trigger('change'); // initial calculation

            // listener for map toggle
            $('#rhumb-dist .toggle-map a').click( function() {
                $('#rhumb-dist .toggle-map').toggle();
                $('#rhumb-dist .map').toggle();

                $('#rhumb-dist .lat1').trigger('change'); // to invoke drawPath()
            });

            // ---- listeners for rhumb lines destination

            // listener for updated values
            $('#rhumb-dest input').change( function() {
                var lat1 = Dms.parseDMS($('#rhumb-dest .lat1').val());
                var lon1 = Dms.parseDMS($('#rhumb-dest .lon1').val());
                var brng = Dms.parseDMS($('#rhumb-dest .brng').val());
                var dist = $('#rhumb-dest .dist').val() * 1000; // convert km to metres

                // calculate destination point
                var p1 = LatLon(lat1, lon1);
                var p2 = p1.rhumbDestinationPoint(dist, brng);

                // display results
                $('#rhumb-dest .result-point').html(p2.toString(degFmt));

                // show path on map
                if ($('#map-rhumb-dest-canvas').is(':visible')) {
                    drawPath(p1.lat, p1.lon, p2.lat, p2.lon, maps.rhumbDest);
                }
            });
            $('#rhumb-dest .lat1').trigger('change'); // initial calculation

            // listener for map toggle
            $('#rhumb-dest .toggle-map a').click( function() {
                $('#rhumb-dest .toggle-map').toggle();
                $('#rhumb-dest .map').toggle();

                $('#rhumb-dest .lat1').trigger('change'); // to invoke drawPath()
            });

            // deg-min-sec / decimal degrees conversion
            $('#latDMS').change( function() { var lat = Dms.parseDMS($('#latDMS').val()); $('#latDM').val(Dms.toLat(lat,'dm',3)); $('#latD').val(Dms.toLat(lat,'d',5)); });
            $('#lonDMS').change( function() { var lon = Dms.parseDMS($('#lonDMS').val()); $('#lonDM').val(Dms.toLon(lon,'dm',3)); $('#lonD').val(Dms.toLon(lon,'d',5)); });
            $('#latDM').change( function() { var lat = Dms.parseDMS($('#latDM').val()); $('#latDMS').val(Dms.toLat(lat,'dms',1)); $('#latD').val(Dms.toLat(lat,'d',5)); });
            $('#lonDM').change( function() { var lon = Dms.parseDMS($('#lonDM').val()); $('#lonDMS').val(Dms.toLon(lon,'dms',1)); $('#lonD').val(Dms.toLon(lon,'d',5)); });
            $('#latD').change( function() { var lat = Dms.parseDMS($('#latD').val()); $('#latDMS').val(Dms.toLat(lat,'dms',1)); $('#latDM').val(Dms.toLat(lat,'dm',3)); });
            $('#lonD').change( function() { var lon = Dms.parseDMS($('#lonD').val()); $('#lonDMS').val(Dms.toLon(lon,'dms',1)); $('#lonDM').val(Dms.toLon(lon,'dm',3)); });

            // listener for display of bearings to user's preference
            $('input[name="deg-format"]').change(function() {
                // record preference in cookie
                Cookies.set('latlon-degree-format', degFmt = $(this).val());

                // trigger recalculations with new format
                $('#ortho-dist .lat1').trigger('change');
                $('#ortho-dest .lat1').trigger('change');
                $('#intersect  .lat1').trigger('change');
                $('#rhumb-dist .lat1').trigger('change');
                $('#rhumb-dest .lat1').trigger('change');
            });

            // ---- url query arguments for distance calculation...

            var from = Qs.parse(location.search.slice(1)).from;
            var to = Qs.parse(location.search.slice(1)).to;
            if (from && to) {
                from = from.split(',');
                to = to.split(',');
                $('#ortho-dist .lat1').val(from[0]);
                $('#ortho-dist .lon1').val(from[1]);
                $('#ortho-dist .lat2').val(to[0]);
                $('#ortho-dist .lon2').val(to[1]);
                //$('#ortho-dist .toggle-map a').trigger('click'); why no work?
                $('#ortho-dist .toggle-map').toggle(); // 'see on map' text
                $('#ortho-dist .map').toggle();        // the map itself
                $('#ortho-dist .lat1').trigger('change'); // to invoke drawPath()
            }


            // ---- ... & destination calculation

            var dist = Qs.parse(location.search.slice(1)).dist;
            var brng = Qs.parse(location.search.slice(1)).brng;
            if (from && dist && brng) {
                from = from.split(',');
                $('#ortho-dest .lat1').val(from[0]);
                $('#ortho-dest .lon1').val(from[1]);
                $('#ortho-dest .brng').val(brng);
                $('#ortho-dest .dist').val(dist);
                //$('#ortho-dist .toggle-map a').trigger('click'); why no work?
                $('#ortho-dest .toggle-map').toggle(); // 'see on map' text
                $('#ortho-dest .map').toggle();        // the map itself
                $('#ortho-dest .lat1').trigger('change'); // to invoke drawPath()
            }

            // show source code
            fetch('//cdn.rawgit.com/chrisveness/geodesy/v1.1.2/latlon-spherical.js')
                .then(function(res) { return res.ok ? res.text() : res.status+' '+res.statusText; })
                .then(function(txt) { doc.qrySel('#latlon-src').textContent = txt; prettyPrint(); })
                .catch(function(err) { doc.qrySel('#error').textContent = err.message; });
            fetch('//cdn.rawgit.com/chrisveness/geodesy/v1.1.2/dms.js')
                .then(function(res) { return res.ok ? res.text() : res.status+' '+res.statusText; })
                .then(function(txt) { doc.qrySel('#dms-src').textContent = txt; prettyPrint(); })
                .catch(function(err) { doc.qrySel('#error').textContent = err.message; });
        //});
*/
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
        //***************************************************************
    


    
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}