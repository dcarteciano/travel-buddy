map = document.querySelector("#map")

// from and to can either be "lat,lon" or an adress
// still needs more error handling
// testing from console
function getMapData(from, to) {
  axios.get('http://www.mapquestapi.com/directions/v2/route?key=EQrA7i7TLmnP9B1ZFC6CRQgsZVFl6XGz&from=' + from + '&to=' + to + '')
    .then(function (res) {
      console.log("res:", res.data);
      return res.data.route.realTime; // can adjust if we want more info, currently returns drivetime in seconds based on current traffic conditions 
    })
    .catch(function (err) {
      console.log(err);
    })
}