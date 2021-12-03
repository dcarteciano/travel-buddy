var driveInfo = {
  driveTime: ""
};

query("41.121264, -111.919899", "41.169600, -112.014570");

function query(latlon1, latlon2) {
  axios.get('http://www.mapquestapi.com/directions/v2/route?key=EQrA7i7TLmnP9B1ZFC6CRQgsZVFl6XGz&from=' + latlon1 + '&to=' + latlon2 + '')
    .then(function (res) {
      console.log("res:", res);
      driveInfo.driveTime = res.data.route.realTime;
      console.log(driveInfo.driveTime);
    })
    .catch(function (err) {
      console.log(err);
    })
}