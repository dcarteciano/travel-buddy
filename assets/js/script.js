var addButton = document.querySelector('#add-item');
var events = document.querySelector('#events');
var title = 'Event Title2';
var time = 'Start Time2';
var info = 'Event Info2';
var subInfo = 'Event Sub Info2: Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid hic nostrum at molestias dolores deserunt quidem pariatur similique';

function addListEl(title, time, info, subInfo) {

  addButton.addEventListener("click", function (){

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
    var listSecColEl = $('<div>');
    listSecColEl.addClass('column').appendTo(listColEl);
    var listSecColBox = $('<div>');
    listSecColBox.addClass('box').appendTo(listSecColEl);
    var listEventInfo = $('<p>');
    listEventInfo.addClass('title is-5').text(info).appendTo(listSecColBox);
    var listEventSubInfo = $('<p>');
    listEventSubInfo.addClass('subtitle').text(subInfo).appendTo(listSecColBox);
    
    listEl.appendTo(events);
    console.log("test");
  });
};

addListEl(title, time, info, subInfo);

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