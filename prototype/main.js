// ------------------------------------ LET/CONST: ID --------------------------------
// --------------------------------------- LOADING -----------------------------------
const contLoad = document.querySelector('#contLoad');               // ??
const nPublicity = document.querySelector('#nPublicity');           // ??

// ------------------------------------ FIRST PAGE -----------------------------------
const firstPage = document.querySelector('#firstPage'); // -------> Startup container.
const btnStart = document.querySelector('#btnStart');
btnStart.addEventListener('click', () => {
    manipulation(firstPage, soundPage);
    setTimeout(() => {
        speechSynthesis.speak(new SpeechSynthesisUtterance('Seleccione una configuración.'));
    }, 1250);
});

// ------------------------------------ SOUND PAGE -----------------------------------
const soundPage = document.querySelector('#soundPage'); // -------> Sound container.
const btnSoundOn = document.querySelector('#btnSoundOn'); // -----> Sound button on.
const btnSoundOff = document.querySelector('#btnSoundOff'); // ---> Sound button off.

let soundConf; // boolean: {true: Sound on, false: sound off}

// ---------- SOUND ON
btnSoundOn.addEventListener('click', () => {
    soundConf = true;
    manipulation(soundPage, optionsPage);
});

// ---------- SOUND OF
btnSoundOff.addEventListener('click', () => {
    soundConf = false;
    manipulation(soundPage, optionsPage);
});

// ------------------------------------ OPTIONS PAGE ---------------------------------
const optionsPage = document.querySelector('#optionsPage'); // ---> Options container.
const btnRoute = document.querySelector('#btnRoute'); // ---------> --
const btnRamp = document.querySelector('#btnRamp');
// const btnGuide = document.querySelector('#btnGuide');
const btnConf = document.querySelector('#btnConf');

btnRoute.addEventListener('click', () => {
    manipulation(optionsPage, mapPage);
});

btnRamp.addEventListener('click', () => {

});

// btnGuide.addEventListener('click', () => {});

btnConf.addEventListener('click', () => {

});

// ------------------------------------ MAP PAGE ---------------------------------
// -------------------- API GOOGLE MAPS --------------------
// -------------------- ROUTE --------------------

const mapPage = document.querySelector('#mapPage');

// ---------- MAP
const divMap = document.querySelector('#map');
// ---------- INPUT: Destine.
const gInput = document.querySelector('#place_input');

// ---------- btn: Route.
const gPath = document.querySelector('#path');
// ---------- INDICATORS.
const indicators = document.querySelector('#indicators');

// Geolocalización (tiempo real).
// navigator.geolocation.watchPosition(fn_ready, fn_stop, {enableHighAccuracy: true});

// Geolocalización (ubicación del dispositivo).
navigator.geolocation.getCurrentPosition(fn_ready, fn_stop, {maximumAge:10000, timeout:5000, enableHighAccuracy: true});

// Fallas en el sistema de geolocalización.
function fn_stop(){
    divMap.innerHTML = 'Hubo un problema al ubicar el dispositivo.';
}

let rGeolocation = false; // Tipo de localización[true: Geolocalización, false: Ubiación IES]
let iAddress; // Destino.

// Sistema de geolocalización funcionando.
function fn_ready(response){

    // Localización del dispositivo.
    let gLatLng; // Google Latitud - Longitud.
    if(rGeolocation){ // Condición: Utilizar ubicación prestablecida - Geolocalización del dispositivo.
        gLatLng = new google.maps.LatLng(response.coords.latitude, response.coords.longitude); // Dispositivo.
    }else{
        gLatLng = new google.maps.LatLng(-31.6464462,-60.7082386); // Ubicación IES.
    }

    // MAP (Ubicación en el globo).
    let gConf = {
        zoom: 17,
        center: gLatLng,
        mapId: '5b39865b8122ce10',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    };

    // ---------- CREATE: MAP ----------
    let gMap = new google.maps.Map(divMap, gConf);

    // MARKER (ubicación actual).
    let objMark = {
        position: gLatLng,
        map: gMap,
        title: 'Usted esta aquí.',
        label: 'U',
        optimized: true,
        draggable: true
    };

    // ---------- CREATE: MARKER ----------
    let gMarker = new google.maps.Marker(objMark);
    let gMarkerDestine = new google.maps.Marker({map: gMap});

    // ---------- CREATE: MARKERS ----------
    /*
    // Data for the markers consisting of a name, a LatLng and a zIndex for the
// order in which these markers should display on top of each other.
const beaches: [string, number, number, number][] = [
  ["Bondi Beach", -33.890542, 151.274856, 4],
  ["Coogee Beach", -33.923036, 151.259052, 5],
  ["Cronulla Beach", -34.028249, 151.157507, 3],
  ["Manly Beach", -33.80010128657071, 151.28747820854187, 2],
  ["Maroubra Beach", -33.950198, 151.259302, 1],
];

function setMarkers(map: google.maps.Map) {
  // Adds markers to the map.

  // Marker sizes are expressed as a Size of X,Y where the origin of the image
  // (0,0) is located in the top left of the image.

  // Origins, anchor positions and coordinates of the marker increase in the X
  // direction to the right and in the Y direction down.
  const image = {
    url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(20, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32),
  };
  // Shapes define the clickable region of the icon. The type defines an HTML
  // <area> element 'poly' which traces out a polygon as a series of X,Y points.
  // The final coordinate closes the poly by connecting to the first coordinate.
  const shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: "poly",
  };

  for (let i = 0; i < beaches.length; i++) {
    const beach = beaches[i];

    new google.maps.Marker({
      position: { lat: beach[1], lng: beach[2] },
      map,
      icon: image,
      shape: shape,
      title: beach[0],
      zIndex: beach[3],
    });
  }
  */

    // ---------- AUTO-SEARCH ----------

    // ---------- INPUT: Destine => Autocomplete.

    const autoComplete = new google.maps.places.Autocomplete(gInput);

    let gCircle = new google.maps.Circle({center: gLatLng, radius: response.coords.accuracy});
    autoComplete.setBounds(gCircle.getBounds());
    autoComplete.setOptions({strictBounds: true})
    autoComplete.setComponentRestrictions({'country': ['ar']});

    function searching(){ // Ubicación de destino.
        rDnone(divMap);
        rVOnone(divMap);
        gDR.set('directions', null);
        const place = autoComplete.getPlace();
        gMap.setCenter(place.geometry.location);
        gMarkerDestine.setPosition(place.geometry.location);
        iAddress = gInput.value;
        gInput.value = '';
    };

    autoComplete.addListener('place_changed', searching); // Evento disparador.

/*
    search.addEventListener('click', () => {
        const place = autoComplete.getPlace();
        gMap.setCenter(place.geometry.location);
        gMarker.setPosition(place.geometry.location);
    });
*/

    let gDS = new google.maps.DirectionsService(); // Obtiene coordenadas.

    let objConfDR = {
        map: gMap,
        suppressMarkers: false
    };

    let gDR = new google.maps.DirectionsRenderer(objConfDR); // Traduce coordenadas a ruta visible.

/*
    let wayPts = [
        {
            location: {lat: -31.647123, lng: -60.705868},
            stopover: false
        }
    ];
*/

    gPath.addEventListener('click', () => {
        gDS.route({origin: gLatLng, destination: iAddress,/* waypoints: wayPts, optimizeWaypoints: true,*/ travelMode: google.maps.TravelMode.WALKING}, fnRoute);
        // google.maps.TravelMode.
        //  -> DRIVING
        //  -> WALKING
        //  -> TRANSIT
        //  -> BICYCLING
    })

    function fnRoute(result, status){
        if(status === google.maps.DirectionsStatus.OK){
            gDR.setDirections(result);
            gDR.setPanel(indicators);
            gMarker.setMap(null);
            gMarkerDestine.setMap(null);
        }else{
            alert('Error '+status);
        }
    };
}

// -------------------- FUNCTIONS ADD/REMOVE --------------------
function manipulation(pageX, pageY){
    removePage(pageX);
    addLoad();
    setTimeout(() => {
        addVOnone(contLoad);
        setTimeout(() => {
            addDnone(contLoad);
        }, 250);
    }, 600);
    setTimeout(() => {
        addPage(pageY);
    }, 600);
};

function removePage(x) {
    x.classList.add('vo-none');
    x.classList.add('d-none');
};

function addPage(x) {
    x.classList.remove('d-none');
    x.classList.remove('vo-none');
};

function addLoad() {
    contLoad.classList.remove('d-none');
    contLoad.classList.remove('vo-none');
};

function rDnone (x) {
    x.classList.remove('d-none');
};

function rVOnone (x){
    x.classList.remove('vo-none');
};

function addDnone (x) {
    x.classList.add('d-none');
};

function addVOnone (x) {
    x.classList.add('vo-none');
}