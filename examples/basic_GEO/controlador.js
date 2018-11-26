var poi1_lat;
var poi1_lng;
var poi2_lat;
var poi2_lng;

var p1;
var p2;
var p3;
var dist1;
var dist2;
var brng1;
var brng2;
var pMid;

var xyz_user;
var xyz_poi1;
var xyz_poi2;

var salto_ctrl = 0;

 if(new_place){
    console.log('SALTO SALTO SALTO');    
    new_place = false;
}

window.addEventListener('load', function() {
    
    // initialize awe after page loads
    window.awe.init({
        // automatically detect the device type
        device_type: awe.AUTO_DETECT_DEVICE_TYPE,
        // populate some default settings
        settings: {
            container_id: 'container',
            fps: 30,
            default_camera_position: { x:0, y:0, z:0 },
            default_lights:[
            {
                id: 'hemisphere_light',
                type: 'hemisphere',
                color: 0xCCCCCC
            }
            ]
        },
        ready: function() {
            var d = '?_='+Date.now();

            // load js files based on capability detection then setup the scene if successful
            awe.util.require([
            {
                capabilities: ['webgl','gum'],
                files: [ 
                [ '../../js/awe-standard-dependencies.js'+d, '../../js/awe-standard.js'+d ], // core dependencies for this app 
                ['../../js/plugins/StereoEffect.js'+d, '../../js/plugins/VREffect.js'+d], // dependencies for render effects
                '../../js/plugins/awe.rendering_effects.js'+d,
                '../../js/plugins/awe-standard-object_clicked_or_focused.js'+d, // object click/tap handling plugin
                'awe.gyro.js'+d, // basic gyro handling
                'awe.mouse.js'+d // basic mouse handling
                ],
                success: function() { 
                    // setup and paint the scene
                    awe.setup_scene();

                    var click_plugin = awe.plugins.view('object_clicked');
                    if (click_plugin) {
                        click_plugin.register();
                        click_plugin.enable();
                    }
                    var gyro_plugin = awe.plugins.view('gyro');
                    if (gyro_plugin) {
                        gyro_plugin.enable();
                    }
                    var mouse_plugin = awe.plugins.view('gyro');
                    if (gyro_plugin) {
                        gyro_plugin.enable();
                    }

                    awe.settings.update({data:{value: 'ar'}, where:{id: 'view_mode'}});
                    var render_effects_plugin = awe.plugins.view('render_effects');
                    if (render_effects_plugin) {
                        render_effects_plugin.enable();
                    }

                    // setup some code to handle when an object is clicked/tapped
                    window.addEventListener('object_clicked', function(e) { 
                        var p = awe.projections.view(e.detail.projection_id);
                        awe.projections.update({ // rotate clicked object by 180 degrees around x and y axes over 10 seconds
                            data:{ animation: { duration: 10 }, rotation:{ y: p.rotation.y+180, x: p.rotation.x+180 } },
                            where:{ id:e.detail.projection_id }
                        });
                    }, false);
                    
                    // Escola Miramar
                    poi1_lat = 41.105243;
                    poi1_lng = 1.145404;   
                    
                    // Decathlon Vilaseca
                    poi2_lat = 41.096458;
                    poi2_lng = 1.151421;                      
                    
                    p1 = LatLon(pos.lat, pos.lng);
                    xyz_user = project(pos.lat, pos.lng, 0.0);
                    // user - poi1
                    p2 = LatLon(poi1_lat, poi1_lng);
                    dist1 = p1.distanceTo(p2);                   
                    xyz_poi1 = project(poi1_lat, poi1_lng, 0.0);                    
                    // user - poi2
                    p3 = LatLon(poi2_lat, poi2_lng);
                    dist2 = p1.distanceTo(p3);                   
                    xyz_poi2 = project(poi2_lat, poi2_lng, 0.0);
                    //brng1 = p1.bearingTo(p2);
                    //brng2 = p1.finalBearingTo(p2);
                    //pMid = p1.midpointTo(p2);
                    
                    console.log('Info USUARI-POI');
                    console.log('---------------');
                    console.log('USER pos lat --> ' + pos.lat);
                    console.log('USER pos lng --> ' + pos.lng);
                    console.log('POI 1 pos lat --> ' + poi1_lat);
                    console.log('POI 1 pos lng --> ' + poi1_lng);
                    console.log('Distància (m) USER-POI1 --> ' + dist1);
                    console.log('Distància (km) USER-POI1 --> ' + (dist1/1000).toPrecision(4));
                    console.log('POI 2 pos lat --> ' + poi2_lat);
                    console.log('POI 2 pos lng --> ' + poi2_lng);
                    console.log('Distància (m) USER-POI2 --> ' + dist2);
                    console.log('Distància (km) USER-POI2 --> ' + (dist2/1000).toPrecision(4));
                    console.log('---------------');
                    
                    console.log('user camera : xyz_user[0] xyz_user[1] xyz_user[2]' + xyz_user[0] + ' ' + xyz_user[1] + ' ' + xyz_user[2]);
                    console.log('escola miramar : xyz_poi1[0] xyz_poi1[1] xyz_poi1[2]' + xyz_poi1[0] + ' ' + xyz_poi1[1] + ' ' + xyz_poi1[2]);
                    console.log('decathlon vilaseca : xyz_poi2[0] xyz_poi2[1] xyz_poi2[2]' + xyz_poi2[0] + ' ' + xyz_poi2[1] + ' ' + xyz_poi2[2]);
                    
                    awe.pois.add({ id:'escola_miramar', position: { x: xyz_poi1[0], y: 0, z: -1 * xyz_poi1[1] } });
                    
                    awe.projections.add({ 
                        id:'id_escola_miramar1', 
                        //geometry:{ shape:'cube', x:50, y:50, z:50 }, 
                        geometry : {
                            font_url : "Times_Bold.js",   /// REQUIRED - currently must be .js not .json
                            parameters : {
                               height : "5", // depth of the extruded text
                               size : "50"
                            },
                            shape : "text", 
                            text : "ESCOLA MIRAMAR"
                        },
                        position: {x:0, y:50, z:0},
                        rotation:{ x:0, y:-45, z:0 },
                        material:{ type: 'phong', color:0x0000FF } }, 
                    { poi_id: 'escola_miramar' });
                    
                    awe.projections.add({ 
                        id:'id_escola_miramar2', 
                        //geometry:{ shape:'cube', x:50, y:50, z:50 }, 
                        geometry : {
                            font_url : "Times_Bold.js",   /// REQUIRED - currently must be .js not .json
                            parameters : {
                               height : "5", // depth of the extruded text
                               size : "50"
                            },
                            shape : "text", 
                            text : (dist1/1000).toPrecision(4) + " km"// put your text here
                        },
                        position: {x:0, y:0, z:0},
                        rotation:{ x:0, y:-45, z:0 },
                        material:{ type: 'phong', color:0x0000FF } }, 
                    { poi_id: 'escola_miramar' });                    
                    
                    //var degFmt = 'latlon-degree-format';
                    //var degFmt = 'dms';
                    //console.log('distancia (dist/1000).toPrecision(4) CONTROLADOR.js --> ' + (dist/1000).toPrecision(4));
                    //console.log('brng1 (Dms.toBrng(brng1, degFmt)) CONTROLADOR.js --> ' + (Dms.toBrng(brng1, degFmt)));
                    //console.log('brng2 (Dms.toBrng(brng2, degFmt)) CONTROLADOR.js --> ' + (Dms.toBrng(brng2, degFmt)));
                    //console.log('pMid (pMid.toString(degFmt)) CONTROLADOR.js --> ' + (pMid.toString(degFmt)));
                                  
       
                    
                    //var gps_user = unproject(xyz_user[0], xyz_user[1], xyz_user[2]);
                    //var gps_poi = unproject(xyz_poi[0], xyz_poi[1], xyz_poi[2]);


                    //var scale = 10000;
                    
                    //awe.pois.add({ id:'amposta', position: { x: poi1_lat*100000, y: 0, z: poi1_lng*100000 } });
                    awe.pois.add({ id:'decathlon_vilaseca', position: { x: xyz_poi2[0], y: 0, z: -1 * xyz_poi2[1] } });
                    
                    salto_ctrl = salto_ctrl + 1;
                    console.log('salto_ctrl --> ' + salto_ctrl);
                    
                    if(new_place){
                        console.log('SALTO SALTO SALTO');    
                        new_place = false;
                    }
                    
                    awe.projections.add({ 
                        id:'id_decathlon_vilaseca1', 
                        //geometry:{ shape:'cube', x:50, y:50, z:50 }, 
                        geometry : {
                            font_url : "Times_Bold.js",   /// REQUIRED - currently must be .js not .json
                            parameters : {
                               height : "5", // depth of the extruded text
                               size : "50"
                            },
                            shape : "text", 
                            text : "DECATHLON VILASECA"
                         },
                        position: {x:0, y:50, z:0},
                        rotation:{ x:0, y:-45, z:0 },
                        material:{ type: 'phong', color:0x0000FF } }, 
                    { poi_id: 'decathlon_vilaseca' });
                    
                    awe.projections.add({ 
                        id:'id_decathlon_vilaseca2', 
                        //geometry:{ shape:'cube', x:50, y:50, z:50 }, 
                        geometry : {
                            font_url : "Times_Bold.js",   /// REQUIRED - currently must be .js not .json
                            parameters : {
                               height : "5", // depth of the extruded text
                               size : "50"
                            },
                            shape : "text", 
                            text : (dist2/1000).toPrecision(4) + " km"// put your text here
                         },
                        position: {x:0, y:0, z:0},                         
                        rotation:{ x:0, y:-45, z:0 },
                        material:{ type: 'phong', color:0x0000FF } }, 
                    { poi_id: 'decathlon_vilaseca' });                    
                    
                    //if (new_place){
                    //awe.povs.update({ data: { position: { x: pos.lat*100000, y: 0, z: pos.lng*100000 } }, where: { id: 'default' } });
                    awe.povs.update({ data: { position: { x: xyz_user[0], y: 0, z: -1 * xyz_user[1] } }, where: { id: 'default' } });
                    //    new_place = false;
                    //}
                    /*
                    var projection_child = awe.projections.view('s').get_mesh().children[0];
                    var projection_params = projection_child.geometry.parameters.parameters;
                    projection_child.geometry = new THREE.TextGeometry( "YOUR NEW TEXT HERE", projection_params );
                    awe.scene_needs_rendering = 1;
                    */
                    /*
                   
                    var test1 = awe.pois.list();
                    var test2 = awe.pov().position;
                    var test3 = awe.pov().get_projection_matrix();
                    var test4 = awe.pov().get_world_position();
                    var test5 = awe.povs.list();
                    var test6 = awe.povs.view();
                    
                    console.log("NEAR:"+awe.pov().near);
                    console.log("FAR:"+awe.pov().far);
                    
                    console.log('awe.pois.list() --> ' + awe.pois.list());
                    console.log('awe.pov().position --> ' + awe.pov().position);
                    console.log('awe.pov().get_projection_matrix --> ' + awe.pov().get_projection_matrix());
                    */
			
                }
            },
            { // else create a fallback
                capabilities: [],
                files: [],
                success: function() { 
                    document.body.innerHTML = '<p>This demo currently requires a standards compliant mobile browser.';
                    return;
                }
            }
        ]);
      }
    });
});