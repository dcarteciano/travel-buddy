var addButton = document.querySelector('#add-item');
var events = document.querySelector('#events');
var hours = document.querySelector('#hours-input');
var cat = document.querySelector('#cat-input');
// var title = 'Event Title2';
// var time = 'Start Time2';
// var info = 'Event Info2';
// var subInfo = 'Event Sub Info2: Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid hic nostrum at molestias dolores deserunt quidem pariatur similique';
// var id = 123456;
var currentLatitude;
var curentLongitude;


function addListEl(title, time, info, subInfo, lat, long) {

  var driveTime = getMapData(currentLatitude + ',' + curentLongitude, lat + ',' + long);
  // var enoughTime = enoughTime(driveTime, startTime);
  // create a container for event
  var listEl = $('<div>');
  listEl.addClass('notification is-primary');
  var listColEl = $('<div>');
  listColEl.addClass('columns').appendTo(listEl);
  var listFirstColEl = $('<div>');
  listFirstColEl.addClass('column is-narrow').appendTo(listColEl);
  var listFirstColBox = $('<div>');
  listFirstColBox.addClass('box').attr('style', 'width: 200px;').appendTo(listFirstColEl);
  var listEventTitle = $('<p>');
  listEventTitle.addClass('title is-5').text(title).appendTo(listFirstColBox);
  var listEventTime = $('<p>');
  listEventTime.addClass('subtitle').text(time).appendTo(listFirstColBox);
  var listEventDriveTime = $('<p>');
  listEventDriveTime.addClass('subtitle').text('Can you make it?' + driveTime).appendTo(listFirstColBox);
  var listSecColEl = $('<div>');
  listSecColEl.addClass('column').appendTo(listColEl);
  var listSecColBox = $('<div>');
  listSecColBox.addClass('box').appendTo(listSecColEl);
  var listEventInfo = $('<p>');
  listEventInfo.addClass('title is-5').text(info).appendTo(listSecColBox);
  var listEventSubInfo = $('<p>');
  listEventSubInfo.addClass('subtitle').text(subInfo).appendTo(listSecColBox);

  listEl.appendTo(events);

};

// from and to can either be "lat,lon" or an adress
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
        modal.addClass("is-active");
        modal.append($("<p>").text("Could not find route"));
        console.log("Could not find route between given locations");
      }
    })
    .catch(function (err) {
      console.log("could not connect to mapquestapi.com");
    })
}

// ticket master api to get events nearby and long/lat
function getApi(cat, lat, long) {
  var requestUrl = 
    'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=' + 
    cat + 
    '&latlong=' + 
    lat + ',' + long + 
    '&radius=100&unit=miles' + 
    '&apikey=OWIi7laz1qDwxQmUKHndhZXCYa98oavA';

  axios.get(requestUrl)
    .then(function (res) {
      console.log('response', res);
      var eventArray = res.data._embedded.events;
      console.log('eventArray', eventArray);
      buildList(eventArray);
    })
    .catch(function (err) {
      console.log(err);
    });
}

function buildList(eventArray){

  for (var i = 0; i < eventArray.length; i++) {
    var eventTitle = eventArray[i].name;
    var eventTime = eventArray[i].dates.start.dateTime;
    var eventInfo = eventArray[i]._embedded.venues[0].name;
    var eventSubInfo = eventArray[i].url;
    var eventLat = eventArray[i]._embedded.venues[0].location.latitude;
    var eventLong = eventArray[i]._embedded.venues[0].location.longitude;
    // var arrival = enoughTime(driveTime, startTime)
    addListEl(eventTitle, eventTime, eventInfo, eventSubInfo, eventLat, eventLong);

  }
}

function getCurrentPos() {
  currentLatitude = 0;
  curentLongitude = 0;

  function success(position) {
    currentLatitude = position.coords.latitude;
    curentLongitude = position.coords.longitude;
    getApi('music', currentLatitude, curentLongitude);
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
// function to check if you have enough time to get to an event
// input is the drive time in seconds and the start time of the event.
function enoughTime(driveTime, startTime){
  var arriveTime = moment().add(driveTime, 'seconds').format();
  //outputs false if the arival time is after the event start time
  if (moment(arriveTime).isAfter(startTime)){
    return false;
    //outputs true if it starts after the arrival time
  } else {
    return true;
  }
}

// enoughTime(600, '2021-12-05T14:39:45-07:00');

document.querySelector('#find-me').addEventListener('click', getCurrentPos);