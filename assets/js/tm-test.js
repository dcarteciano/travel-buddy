//   We used this file to test the APIs without distrurbing the other code

// var filmsNowShowing = {
//   "url": "https://api-gate2.movieglu.com/filmsNowShowing/?n=25",
//   "method": "GET",
//   "timeout": 0,
//   "headers": {
//     "api-version": "v200",
//     "Authorization": "Basic VU5JVl81NDpnYUhaR0NxNm1MU2o=",
//     "client": "UNIV_54",
//     "x-api-key": "KJxQ3LIeJi9v1XVAKbzcc5R0tCYpdsID6aAGkv1R",
//     "device-datetime": "2021-12-09T19:51:20+0000",
//     "territory": "US",
//     },
//   };

//   $.ajax(filmsNowShowing).done(function (response) {
//   console.log(response);
//   });

// var filmShowtimes = {
//   "url": "https://api-gate2.movieglu.com/filmShowTimes/?film_id=315323&date=2021-12-10&n=25",
//   "method": "GET",

// "timeout": 0,
//   "headers": {
//     "geolocation": "40.4896;-111.9400",
//     "api-version": "v200",
//     "Authorization": "Basic VU5JVl81NTpMMzVtemRyenhUQ3Q=",
//     "client": "UNIV_54",
//     "x-api-key": "5SNa2JxuS81Ez99j1qXhA8bWvOiWsWjd14bJtU1T",
//     "device-datetime": "2021-12-10T21:09:48-07:00",
//     "territory": "US",
//     },
//   };

//   $.ajax(filmShowtimes).done(function (response) {
//   console.log(response);
//   });

// axios.get('https://www.mapquestapi.com/directions/v2/route?key=EQrA7i7TLmnP9B1ZFC6CRQgsZVFl6XGz&from=' + from + '&to=' + to)
//     .then(function (res) {

//     };

// var directions = {
//   "url": "https://api.mapbox.com/directions/v5/mapbox/driving/-111.886902%2C40.426491%3B-111.926331%2C40.4752595?alternatives=true&geometries=geojson&language=en&overview=simplified&steps=true&access_token=pk.eyJ1Ijoiam9obmRhdmlzOTI3OTAiLCJhIjoiY2t4NDZlNWJ5MjVoYjJucW9kcm5jdGQxZyJ9.1CTxHYCYILbYZTJvrvtwqw"
//   };

// $.ajax(directions).done(function (res) {
//   console.log(res);
// });

var obj = {
    times:
    {
        pageLoad: moment(),
        pageLoadUTC: moment.utc(),
        now: function () {
            var now = moment();
            return now;
        },
        nowUTC: function () {
            var nowUTC = moment.utc();
            return nowUTC;
        }
    },
    dates:
    {
        today: moment().format('YYYY, MM, DD')
    }
}

now = obj.times.now();
nowUTC = obj.times.nowUTC();
console.log("Now: ", now, "Now UTC: ", nowUTC, "Date: ", obj.dates.today);

var testTime = moment().add(3, "hours");
console.log("Test Time: ", testTime);
var duration = moment.duration(testTime.diff(obj.times.now()));
console.log("Duration", duration);
console.log("Difference", (obj.times.now().diff(testTime)) / 1000 / 60 / 60);
var arrivalTime = obj.times.now().add(600, "seconds");
console.log(arrivalTime);
var newDate = new Date(obj.dates.today)
var time = "7:30 pm"
var split = time.split(" ");
var timeSplit = split[0].split(":");
if (split[1] === "pm") {
    timeSplit[0] = parseFloat(timeSplit[0]) + 12;
}
console.log("time split:", timeSplit);
var timeObj = moment(newDate).add(timeSplit[0], "hours").add(timeSplit[1], "minutes");
console.log(timeObj.format());
