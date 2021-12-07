var addButton = document.querySelector('#add-item');
var events = document.querySelector('#events');
var radius = 100; //search radius for ticketmaster events
var currentLatitude;
var curentLongitude;
// last modal input, if value is needed elsewhere it should be stored in a separate var as a new input in modal will overwrite the var
var modelInput;

function getCurrentPos(cat, hours) {
  currentLatitude = 0;
  curentLongitude = 0;

  function success(position) {
    currentLatitude = position.coords.latitude;
    curentLongitude = position.coords.longitude;
    getApi(cat, hours, currentLatitude, curentLongitude);
  }

  function error() {
    modal('Error', 'Unable to retrieve your location');
  }

  if (!navigator.geolocation) {
    modal('Error', 'Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

// ticket master api to get events nearby and long/lat
function getApi(cat, hours, currentLatitude, curentLongitude) {
  var requestUrl =
    'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=' +
    cat +
    '&latlong=' +
    currentLatitude + ',' + curentLongitude +
    '&radius=' + radius + '&unit=miles' +
    '&apikey=OWIi7laz1qDwxQmUKHndhZXCYa98oavA';

  axios.get(requestUrl)
    .then(function (res) {
      console.log('response', res);
      var eventArray = res.data._embedded.events;
      console.log('eventArray', eventArray);
      buildList(eventArray, hours);
    })
    .catch(function (err) {
      console.log(err);
    });
}

function buildList(eventArray, hours) {
  for (var i = 0; i < eventArray.length; i++) {
    var eventTitle = eventArray[i].name;
    var eventTime = eventArray[i].dates.start.dateTime;
    var eventInfo = eventArray[i]._embedded.venues[0].name;
    var eventSubInfo = eventArray[i].url;
    var eventLat = eventArray[i]._embedded.venues[0].location.latitude;
    var eventLong = eventArray[i]._embedded.venues[0].location.longitude;
    getMapData(currentLatitude + ',' + curentLongitude, eventLat + ',' + eventLong,
      eventTitle, eventTime, eventInfo, eventSubInfo, hours);
  }
}

// from and to can either be "lat,lon" or an adress
function getMapData(from, to, eventTitle, eventTime, eventInfo, eventSubInfo, hours) {
  axios.get('http://www.mapquestapi.com/directions/v2/route?key=diSZVTUqXE3YRm5IRyRe5IWmMHZWbypB&from=' + from + '&to=' + to + '')
    .then(function (res) {
      console.log("mapquest:", res.data);
      if (res.data.route.realTime > 0) {
        if (res.data.route.realTime < 10000000) {
          console.log("Drive time: " + res.data.route.realTime);
          // returns drivetime data in seconds based off of realtime traffic conditions
          enoughTime(res.data.route.realTime, eventTitle, eventTime, eventInfo, eventSubInfo);
        }
        else {
          console.log("realtime data unavailable", "Drive time: " + res.data.route.time);
          // if realtime data is unavailable, returns calculated drivetime time in seconds
          enoughTime(res.data.route.time, eventTitle, eventTime, eventInfo, eventSubInfo);
        }
      }
      else {
        modal.addClass("is-active");
        modal.append($("<p>").text("Could not find route"));
        console.log("Could not find route between given locations");
      }
    })
    .catch(function (err) {
      console.log("could not connect to mapquestapi.com", err);
    })
}

// function to check if you have enough time to get to an event
// input is the drive time in seconds and the start time of the event.
function enoughTime(driveTime, eventTitle, eventTime, eventInfo, eventSubInfo) {
  var arriveTime = moment().add(driveTime, 'seconds').format();
  //outputs false if the arival time is after the event start time
  if (moment(arriveTime).isAfter(eventTime)) {
    var arrival = false;
    addListEl(eventTitle, eventTime, eventInfo, eventSubInfo, arrival);
    //outputs true if it starts after the arrival time
  } else {
    var arrival = true;
    addListEl(eventTitle, eventTime, eventInfo, eventSubInfo, arrival);
  }
}

function addListEl(eventTitle, eventTime, eventInfo, eventSubInfo, arrival) {
  if (arrival) {
    arrival = 'Yes!';
  } else {
    arrival = 'No!';
  }
  eventTime = moment(eventTime).format('MMMM Do YYYY, h:mm:ss a');

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
  listEventTitle.addClass('title is-4').text(eventTitle).appendTo(listFirstColBox);
  var listEventInfo = $('<p>');
  listEventInfo.addClass('title is-5').text(eventInfo).appendTo(listFirstColBox);
  var listEventTime = $('<p>');
  listEventTime.addClass('title is-6').text(eventTime).appendTo(listFirstColBox);
  var listSecColEl = $('<div>');
  listSecColEl.addClass('column').appendTo(listColEl);
  var listSecColBox = $('<div>');
  listSecColBox.addClass('box').appendTo(listSecColEl);
  var listEventDriveTime = $('<p>');
  listEventDriveTime.addClass('subtitle').text('Can you make it? ' + arrival).appendTo(listSecColBox);

  // https://google.com/maps/dir//Vivint+Arena/@40.6219482,-112.0623527,11
  
  var listEventSubInfo = $('<a>')
    .attr('href', eventSubInfo)
    .attr('target', '_blank')
    .addClass('button is-success')
    .text('Get Tickets');
  listEventSubInfo.appendTo(listSecColBox);

  listEl.appendTo(events);
};

// modal use
// for a simple message use a string for title and info 
// for a form isForm needs to be true
function modal(title, info, isForm, btnText) {
  var content = $(".modal-content");

  // Displays Form
  if (isForm) {
    var formEl = $("<form>").addClass("field");
    var labelEl = $("<label>").addClass("label").text(title);
    var infoEL = $("<p>").text(info);
    var inputEl = $("<input>").addClass("input is-success").attr("id", "modal-input");
    var btnEl = $("<button>").addClass("button is-success").attr("id", "modal-submit").text(btnText);
    formEl.append(labelEl, infoEL, inputEl, btnEl);
    content.append(formEl);

    btnEl.on("click", function (event) {
      event.preventDefault();
      modalInput = $("#modal-input").val().trim();
      toggleModal();
    });
  }

  // Displays Message
  else {
    textEl = $("<p>");
    titleEl = $("<strong>").text(title);
    infoEl = $("<p>").text(info);
    textEl.append(titleEl, infoEl);
    content.append(textEl);
  }

  function toggleModal() {
    var display = $(".modal");
    if (display.hasClass("is-active")) {
      display.removeClass("is-active")
      content.empty();
    }
    else {
      display.addClass("is-active");
    }
  }

  $(".modal-close").on("click", toggleModal);

  toggleModal();
}

$('#find-me').click(function () {
  var cat = $("#cat-input").val();
  var hours = $("#hours-input").val();
  if (cat) {
    getCurrentPos(cat, hours);
  } else {
    console.log('modal');
  }
});

// for testing modal form 
document.querySelector("#form-test").addEventListener("click", function () {
  modal("Title", "Info: Modal form stores input in modalInput var", true, "Submit");
});