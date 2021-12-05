// from and to can either be "lat,lon" or an adress
// testing from console
function getMapData(from, to) {
  axios.get('http://www.mapquestapi.com/directions/v2/route?key=EQrA7i7TLmnP9B1ZFC6CRQgsZVFl6XGz&from=' + from + '&to=' + to + '')
    .then(function (res) {
      console.log("mapquest:", res.data);
      if (res.data.route.realTime > 0) {
        return res.data.route.realTime; // can adjust if we want more info, currently returns drivetime in seconds based on current traffic conditions 
      }
      else {
        console.log("Could not find route between given locations");
        return;
      }
    })
    .catch(function (err) {
      console.log("could not connect to mapquestapi.com");
    })
}

function geoFindMe() {

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log(latitude, longitude);
  }

  function error() {
    console.log('Unable to retrieve your location');
  }

  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }

}

document.querySelector('#find-me').addEventListener('click', geoFindMe);