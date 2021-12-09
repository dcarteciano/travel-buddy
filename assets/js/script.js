var addButton = document.querySelector('#add-item');
var events = document.querySelector('#events');
var radius = 100; //search radius for ticketmaster events
var currentLatitude;
var curentLongitude;
// last modal input, if value is needed elsewhere it should be stored in a separate var as a new input in modal will overwrite the var
var modelInput;

function getCurrentPos(cat) {
  currentLatitude = 0;
  curentLongitude = 0;

  function success(position) {
    currentLatitude = position.coords.latitude;
    curentLongitude = position.coords.longitude;
    getApi(cat, currentLatitude, curentLongitude);
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
function getApi(cat, currentLatitude, curentLongitude) {
  var requestUrl =
    'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=' +
    cat +
    '&latlong=' +
    currentLatitude + ',' + curentLongitude +
    '&radius=' + radius + '&unit=miles' +
    '&sort=date,asc' + 
    '&apikey=OWIi7laz1qDwxQmUKHndhZXCYa98oavA';

  axios.get(requestUrl)
    .then(function (res) {
      console.log('response', res);
      var eventArray = res.data._embedded.events;
      console.log('eventArray', eventArray);
      buildList(eventArray);
    })
    .catch(function (err) {
      modal("Error", "Could not connect to ticketmaster.com");
    });
}

function buildList(eventArray) {
  // takes the different objects of the event array and stores them to seperate variables
  for (var i = 0; i < eventArray.length; i++) {
    var eventTitle = eventArray[i].name;
    var eventTime = eventArray[i].dates.start.dateTime;
    var eventInfo = eventArray[i]._embedded.venues[0].name;
    var eventSubInfo = eventArray[i].url;
    var eventLat = eventArray[i]._embedded.venues[0].location.latitude;
    var eventLong = eventArray[i]._embedded.venues[0].location.longitude;
    getMapData(currentLatitude + ',' + curentLongitude, eventLat + ',' + eventLong,
      eventTitle, eventTime, eventInfo, eventSubInfo);
  }
}

// from and to can either be "lat,lon" or an adress
function getMapData(from, to, eventTitle, eventTime, eventInfo, eventSubInfo) {
  axios.get('https://www.mapquestapi.com/directions/v2/route?key=diSZVTUqXE3YRm5IRyRe5IWmMHZWbypB&from=' + from + '&to=' + to + '')
    .then(function (res) {
      if (res.data.route.realTime > 0) {
        if (res.data.route.realTime < 10000000) {
          var leaveByTime = moment(eventTime).subtract(res.data.route.realTime, 'seconds');
          // returns drivetime data in seconds based off of realtime traffic conditions
          addListEl(eventTitle, eventTime, eventInfo, eventSubInfo, leaveByTime);
        }
        else {
          var leaveByTime = moment(eventTime).subtract(res.data.route.realTime, 'seconds');
          // if realtime data is unavailable, returns calculated drivetime time in seconds
          addListEl(eventTitle, eventTime, eventInfo, eventSubInfo, leaveByTime);
        }
      }
      else {
        modal("Error", "Could not find route between given locations");
      }
    })
    .catch(function (err) {
      console.log(err);
      modal("Error", "Could not connect to mapquest.com");
    })
}

function addListEl(eventTitle, eventTime, eventInfo, eventSubInfo, leaveByTime) {

  eventTime = moment(eventTime).format('MMMM Do YYYY, h:mm:ss a');
  leaveByTime = moment(leaveByTime).format('LT');

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
  listEventDriveTime.addClass('subtitle').text('Leave by ' + leaveByTime).appendTo(listSecColBox);

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
  if (title === "Error") {
    content.addClass("is-danger");
  }
  else {
    content.addClass("is-success");
  }

  // Displays Form
  if (isForm) {
    var formEl = $("<form>").addClass("field is-success");
    var labelEl = $("<label>").addClass("label message-header").text(title);
    var infoEL = $("<p>").addClass("message-body").text(info);
    var inputEl = $("<input>").addClass("input is-success").attr("id", "modal-input");
    var btnEl = $("<button>").addClass("button is-success").attr("id", "modal-submit").text(btnText);
    formEl.append(labelEl, infoEL, inputEl);
    content.append(formEl, btnEl);

    btnEl.on("click", function (event) {
      event.preventDefault();
      modalInput = $("#modal-input").val().trim();
      toggleModal();
    });
  }

  // Displays Message
  else {
    textEl = $("<p>");
    titleEl = $("<strong>").addClass("message-header").text(title);
    infoEl = $("<p>").addClass("message-body").text(info);
    textEl.append(titleEl, infoEl);
    content.append(textEl);
  }

  toggleModal();
}

// auto called in modal, needs to be called if using additional custom buttons on modal
function toggleModal() {
  var display = $(".modal");
  if (display.hasClass("is-active")) {
    display.removeClass("is-active");
    $(".modal-content").removeClass("is-success is-warning is-danger").empty();
  }
  else {
    display.addClass("is-active");
  }
}

$(".modal-close").on("click", toggleModal);
$(".modal-background").on("click", toggleModal);

// After get events button is clicked user is taken step by step through the input forms
function start() {
  var cat;
  

  function getCategory() {
    modal("Category", "What type of event are you looking for?", true, "Submit");
    $("#modal-submit").on("click", function () {
      if (modalInput) {
        cat = modalInput;
        modalInput = "";
        locationType();
      }
    })
  }

  function locationType() {
    modal("Location", "Use current address or enter a starting address to get drive time");
    var modalContentEl = $(".modal-content")
    var paginationEl = $("<div>").addClass("pagination").attr("aria-label", "pagination");
    var posBtn = $("<button>").addClass("button is-success pagination-previous");
    var iSpanEl = $("<span>").addClass("icon");
    var iconEl = $("<i>").addClass("fas fa-location-arrow").attr("aria-hidden", "true");
    var textSpanEl = $("<span>").text("My Location");
    iSpanEl.append(iconEl);
    posBtn.append(iSpanEl, textSpanEl);
    modalContentEl.append(posBtn);

    display = $(".modal");
    posBtn.on("click", function () {
      toggleModal();
      getCurrentPos(cat);
    });
  }
  getCategory();
}

// for testing modal form 
document.querySelector("#get-events").addEventListener("click", function () {
  start();
});