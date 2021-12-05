// from and to can either be "lat,lon" or an adress
// testing from console
function getMapData(from, to) {
  axios.get('http://www.mapquestapi.com/directions/v2/route?key=EQrA7i7TLmnP9B1ZFC6CRQgsZVFl6XGz&from=' + from + '&to=' + to + '')
    .then(function (res) {
      console.log("mapquest:", res.data);
      if (res.data.route.realTime > 0) {
        if (res.data.route.realTime < 10000000) {
          console.log("Drive time: " + res.data.route.realTime);
          return res.data.route.realTime; // returns drivetime data in seconds based off of realtime traffic conditions
        }
        else {
          console.log("realtime data unavailable", "Drive time: " + res.data.route.time);
          return res.data.route.time; // if realtime data is unavailable, returns calculated drivetime time in seconds
        }
      }
      else {
        console.log("Could not find route between given locations");
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

    getMapData([latitude, longitude], "salt lake city"); //test location
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