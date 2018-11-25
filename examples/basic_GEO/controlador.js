var poi1_lat;
var poi1_lng;

var p1;
var p2;
var dist;
var brng1;
var brng2;
var pMid;

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
                    
                    // xiribecs
                    poi1_lat = 40.705411;
                    poi1_lng = 0.583284;         
                    
                    console.log('POS LAT USER CONTROLADOR.JS --> ' + pos.lat);
                    console.log('POS LNG USER CONTROLADOR.JS --> ' + pos.lng);
                    
                    p1 = LatLon(pos.lat, pos.lng);
                    p2 = LatLon(poi1_lat, poi1_lng);
                    dist = p1.distanceTo(p2);
                    brng1 = p1.bearingTo(p2);
                    brng2 = p1.finalBearingTo(p2);
                    pMid = p1.midpointTo(p2);
                    
                    console.log('p1 POI CONTROLADOR.JS --> ' + p1);
                    console.log('p2 USER CONTROLADOR.JS --> ' + p2);
                    console.log('dist CONTROLADOR.JS --> ' + dist);
                    console.log('brng1 CONTROLADOR.JS --> ' + brng1);
                    console.log('brng2 CONTROLADOR.JS --> ' + brng2);
                    console.log('pMid CONTROLADOR.JS --> ' + pMid);
                    //var degFmt = 'latlon-degree-format';
                    var degFmt = 'dms';
                    console.log('distancia (dist/1000).toPrecision(4) CONTROLADOR.js --> ' + (dist/1000).toPrecision(4));
                    console.log('brng1 (Dms.toBrng(brng1, degFmt)) CONTROLADOR.js --> ' + (Dms.toBrng(brng1, degFmt)));
                    console.log('brng2 (Dms.toBrng(brng2, degFmt)) CONTROLADOR.js --> ' + (Dms.toBrng(brng2, degFmt)));
                    console.log('pMid (pMid.toString(degFmt)) CONTROLADOR.js --> ' + (pMid.toString(degFmt)));
              
       
                    var scale = 10000;
                    
                    awe.pois.add({ id:'amposta', position: { x: poi1_lat*dist, y: 0, z: poi1_lng*dist } });
                    
                    awe.projections.add({ 
                        id:'testAmposta', 
                        geometry:{ shape:'cube', x:5, y:5, z:5 }, 
                        rotation:{ x:30, y:30, z:0 },
                        material:{ type: 'phong', color:0x0000FF } }, 
                    { poi_id: 'amposta' });
                    
                    //if (new_place){
                        awe.povs.update({ data: { position: { x: pos.lat*dist, y: 0, z: pos.lng*dist } }, where: { id: 'default' } });
                    //    new_place = false;
                    //}
                    
                    
                   
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