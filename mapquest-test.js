function getMapData(from, to) {
  axios.get('http://www.mapquestapi.com/directions/v2/route?key=EQrA7i7TLmnP9B1ZFC6CRQgsZVFl6XGz&from=' + from + '&to=' + to + '')
    .then(function (res) {
      console.log("res:", res);
      return res.data.route.realTime;
    })
    .catch(function (err) {
      console.log(err);
    })
}