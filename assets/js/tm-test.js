// axios.get('https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&dmaId=324&apikey=OWIi7laz1qDwxQmUKHndhZXCYa98oavA')
//   .then(function (res){
//     console.log(res);
//   })
//   .catch(function (err) {
//     console.log(err);
// });

var filmsNowShowing = {
  "url": "https://api-gate2.movieglu.com/filmsNowShowing/?n=25",
  "method": "GET",
  "timeout": 0,
  "headers": {
    "api-version": "v200",
    "Authorization": "Basic VU5JVl81NDpnYUhaR0NxNm1MU2o=",
    "client": "UNIV_54",
    "x-api-key": "KJxQ3LIeJi9v1XVAKbzcc5R0tCYpdsID6aAGkv1R",
    "device-datetime": "2021-12-08T19:34:05+0000",
    "territory": "US",
    },
  };
  
  $.ajax(filmsNowShowing).done(function (response) {
  console.log(response);
  });

  var filmShowtimes = {
    "url": "https://api-gate2.movieglu.com/filmShowTimes/?film_id=315323&date=2021-12-08&n=25",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "geolocation": "40.489632;-111.940018",
      "api-version": "v200",
      "Authorization": "Basic VU5JVl81NDpnYUhaR0NxNm1MU2o=",
      "client": "UNIV_54",
      "x-api-key": "KJxQ3LIeJi9v1XVAKbzcc5R0tCYpdsID6aAGkv1R",
      "device-datetime": "2021-12-08T19:34:05+0000",
      "territory": "US",
      },
    };
    
    $.ajax(filmShowtimes).done(function (response) {
    console.log(response);
    });
  