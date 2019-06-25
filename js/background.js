if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
var container, stats;
var camera, scene, renderer, light;
var controls, water;
init();
animate();
function init() {
    container = document.getElementById( 'container' );
    //
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    //
    scene = new THREE.Scene();
    //
    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( 30, 30, 100 );
    //
    light = new THREE.DirectionalLight( 0x001e0f,  1.0 );
    scene.add( light );
    // Water
    var waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
    water = new THREE.Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load( 'images/waternormals.jpg', function ( texture ) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            } ),
            alpha: 1.0,
            sunDirection: light.position.clone().normalize(),
            sunColor: 0x001e0f,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );
    water.rotation.x = - Math.PI / 2;
    scene.add( water );
    // Skybox
    var sky = new THREE.Sky();
    var uniforms = sky.material.uniforms;
    uniforms[ 'turbidity' ].value = 5;
    uniforms[ 'rayleigh' ].value = 10;
    uniforms[ 'luminance' ].value = 1;
    uniforms[ 'mieCoefficient' ].value = 0.005;
    uniforms[ 'mieDirectionalG' ].value = 0.8;
    var parameters = {
        distance: 400,
        inclination: 0.49,
        azimuth: 0.205
    };
    var cubeCamera = new THREE.CubeCamera( 0.1, 1, 512 );
    cubeCamera.renderTarget.texture.generateMipmaps = true;
    cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
    scene.background = cubeCamera.renderTarget;
    function updateSun() {
        var theta = Math.PI * ( parameters.inclination - 0.5 );
        var phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );
        light.position.x = parameters.distance * Math.cos( phi );
        light.position.y = parameters.distance * Math.sin( phi ) * Math.sin( theta );
        light.position.z = parameters.distance * Math.sin( phi ) * Math.cos( theta );
        sky.material.uniforms[ 'sunPosition' ].value = light.position.copy( light.position );
        water.material.uniforms[ 'sunDirection' ].value.copy( light.position ).normalize();
        cubeCamera.update( renderer, sky );
    }
    updateSun();
    //
    var geometry = new THREE.IcosahedronBufferGeometry( 20, 1 );
    var count = geometry.attributes.position.count;
    var colors = [];
    var color = new THREE.Color();
    for ( var i = 0; i < count; i += 3 ) {
        color.setHex( Math.random() * 0xffffff );
        colors.push( color.r, color.g, color.b );
        colors.push( color.r, color.g, color.b );
        colors.push( color.r, color.g, color.b );
    }
    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    var material = new THREE.MeshStandardMaterial( {
        vertexColors: THREE.VertexColors,
        roughness: 0.0,
        flatShading: true,
        envMap: cubeCamera.renderTarget.texture,
        side: THREE.DoubleSide
    } );

    //
    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    var time = performance.now() * 0.001;
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    renderer.render( scene, camera );
}

//Countdown plugin

(function($) {
    $.fn.countdown = function(options, callback) {

        //custom 'this' selector
        var thisEl = $(this);

        //array of custom settings
        var settings = {
            'date': null,
            'format': null
        };

        //append the settings array to options
        if(options) {
            $.extend(settings, options);
        }

        //main countdown function
        var countdown_proc = function () {

            var eventDate = Date.parse(settings['date']) / 1000;
            var currentDate = ($.now() / 1000);

            if(eventDate <= currentDate) {
                callback.call(this);
                clearInterval(interval);
            };

            var seconds = eventDate - currentDate;

            var days = Math.floor(seconds / (60 * 60 * 24)); //calculate the number of days
            seconds -= days * 60 * 60 * 24; //update the seconds variable with no. of days removed

            var hours = Math.floor(seconds / (60 * 60));
            seconds -= hours * 60 * 60; //update the seconds variable with no. of hours removed

            var minutes = Math.floor(seconds / 60);
            seconds -= minutes * 60; //update the seconds variable with no. of minutes removed


            var offsetdays = ((672 * (24 - hours) * 60 * 60) / 86400);
            var offsethours = ((609 * (60 - minutes) * 60) / 3600);
            var offsetminutes = ((547 * (60 - seconds)) / 60);
            var offsetsecondes = (484 * (60 - seconds));

            var seconds = Math.floor(seconds);

            //logic for the two_digits ON setting
            if(settings['format'] == "on") {
                days = (String(days).length >= 2) ? days : "0" + days;
                hours = (String(hours).length >= 2) ? hours : "0" + hours;
                minutes = (String(minutes).length >= 2) ? minutes : "0" + minutes;
                seconds = (String(seconds).length >= 2) ? seconds : "0" + seconds;
            }

            //update the countdown's html values.
            if(!isNaN(eventDate)) {
                thisEl.find(".days").text(days);
                thisEl.find(".hours").text(hours);
                thisEl.find(".minutes").text(minutes);
                thisEl.find(".seconds").text(seconds);
            } else {
                alert("Invalid date. Here's an example: 12 Tuesday 2012 17:30:00");
                clearInterval(interval);
            }
            //defini le debut du cercle
            $('.days-c').css({
                'stroke-dashoffset' : offsetdays
            });
            $('.hours-c').css({
                'stroke-dashoffset' : offsethours
            });
            $('.minutes-c').css({
                'stroke-dashoffset' : offsetminutes
            });
            $('.secondes-c').css({
                'stroke-dashoffset' : offsetsecondes
            });
        }

        //run the function
        countdown_proc();


        //loop the function
        interval = setInterval(countdown_proc, 10);

    }
}) (jQuery);


//Call countdown plugin
$(".countdown").countdown({
        date: "9 july 2020 0:00:00", // add the countdown's end date (i.e. 3 november 2012 12:00:00)
        format: "on" // on (03:07:52) | off (3:7:52) - two_digits set to ON maintains layout consistency
    },

    function() {

        // the code here will run when the countdown ends
        alert("done!")

    });
