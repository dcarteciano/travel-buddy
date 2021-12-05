// from and to can either be "lat,lon" or an adress
// testing from console
function getMapData(from, to) {
  axios.get('http://www.mapquestapi.com/directions/v2/route?key=EQrA7i7TLmnP9B1ZFC6CRQgsZVFl6XGz&from=' + from + '&to=' + to + '')
    .then(function (res) {
      console.log("mapquest:", res.data);
      if (res.data.route.realTime > 0) {
        return res.data.route.realTime; // can adjust if we want more info, currently returns drivetime in seconds based on current traffic conditions 
      }
      else{
        console.log("Could not find route between given locations");
        return;
      }
    })
    .catch(function (err) {
      console.log("could not connect to mapquestapi.com");
    })
}