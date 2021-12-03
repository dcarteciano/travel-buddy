axios.get('http://www.mapquestapi.com/directions/v2/route?key=EQrA7i7TLmnP9B1ZFC6CRQgsZVFl6XGz&from=37.79867,-122.39925&to=40.475273,-111.926357')
  .then(function (res){
    console.log(res);
  })
  .catch(function (err) {
    console.log(err);
});