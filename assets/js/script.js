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
      modal("Error", "Could not connect to ticketmaster.com");
    });
}

function buildList(eventArray, hours) {
  console.log(hours);
  // takes the dateTime objects from the event array and pushes them to another array to be sorted by date and time
  var dateTimeArr = [];
  for (var i = 0; i < eventArray.length; i++) {
    var tempTime = eventArray[i].dates.start.dateTime;
    dateTimeArr.push(tempTime)
  }
  dateTimeArr.sort()
  // takes the different objects of the event array and stores them to seperate variables
  for (var i = 0; i < eventArray.length; i++) {
    var eventTitle = eventArray[i].name;
    var eventTime = dateTimeArr[i];
    var eventInfo = eventArray[i]._embedded.venues[0].name;
    var eventSubInfo = eventArray[i].url;
    var eventLat = eventArray[i]._embedded.venues[0].location.latitude;
    var eventLong = eventArray[i]._embedded.venues[0].location.longitude;
    getMapData(currentLatitude + ',' + curentLongitude, eventLat + ',' + eventLong,
      eventTitle, eventTime, eventInfo, eventSubInfo, hours);
  }

  console.log(dateTimeArr);
}

// from and to can either be "lat,lon" or an adress
function getMapData(from, to, eventTitle, eventTime, eventInfo, eventSubInfo, hours) {
  axios.get('https://www.mapquestapi.com/directions/v2/route?key=diSZVTUqXE3YRm5IRyRe5IWmMHZWbypB&from=' + from + '&to=' + to + '')
    .then(function (res) {
      if (res.data.route.realTime > 0) {
        if (res.data.route.realTime < 10000000) {
          // returns drivetime data in seconds based off of realtime traffic conditions
          enoughTime(res.data.route.realTime, eventTitle, eventTime, eventInfo, eventSubInfo);
        }
        else {
          // if realtime data is unavailable, returns calculated drivetime time in seconds
          enoughTime(res.data.route.time, eventTitle, eventTime, eventInfo, eventSubInfo);
        }
      }
      else {
        modal("Error", "Could not find route between given locations");
      }
    })
    .catch(function (err) {
      modal("Error", "Could not connect to mapquest.com");
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

  console.log(eventTime)

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

  // Style
  if (title === "Error") {
    content.addClass("is-danger");
  }
  else {
    content.addClass("is-success");
  }

  //#region Form
  if (isForm) {
    var formEl = $("<form>").addClass("field is-success");
    var labelEl = $("<label>").addClass("label message-header").text(title);
    var infoEl = $("<p>").addClass("message-body").text(info);
    var inputEl = $("<input>").addClass("input is-success").attr("id", "modal-input");
    var btnEl = $("<button>").addClass("button is-success").attr("id", "modal-submit").text(btnText);
    formEl.append(labelEl, infoEl, inputEl);
    content.append(formEl, btnEl);

    btnEl.on("click", function (event) {
      event.preventDefault();
      modalInput = $("#modal-input").val().trim();
      toggleModal();
    });
  }
  //#endregion

  //#region Message
  else {
    textEl = $("<p>");
    titleEl = $("<strong>").addClass("message-header").text(title);
    infoEl = $("<p>").addClass("message-body").text(info);
    textEl.append(titleEl, infoEl);
    content.append(textEl);
  }
  //#endregion

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

// After get events button is clicked user is taken step by step through the input forms
function start() {
  var cat;

  // Prompt for user input to get category for ticketmaster

  //#region dropdown
  modal("Category", "What type of event are you looking for?");
  var dropEl = $("<div>").addClass("dropdown");
  var dropTrigEl = $("<div>").addClass("dropdown-trigger");
  var dropBtnEl = $("<button>").addClass("button").attr("aria-haspopup", "true").attr("aria-controls", "dropdown-menu");
  var dropTextEl = $("<span>").text("Category");
  var dropBtnSpanEl = $("<span>").addClass("icon is-small");
  var dropBtnIEl = $("<i>").addClass("fas fa-angle-down").attr("aria-hidden", "true");

  dropBtnSpanEl.append(dropBtnIEl);
  dropBtnEl.append(dropTextEl, dropBtnSpanEl);
  dropTrigEl.append(dropBtnEl);

  var dropMenuEL = $("<div>").addClass("dropdown-menu").attr("id", "dropdown-menu").attr("role", "menu");
  var dropContentEl = $("<div>").addClass("dropdown-content");
  var categoriesEl = [
    "Any",
    "Music",
    "Sports",
    "Arts",
    "Concerts",
    "Family",
    "Fairs"
  ];
  for (i = 0; i < categoriesEl.length; i++) {
    dropContentEl.append($("<div>").addClass("dropdown-item").text(categoriesEl[i]));
  }
  dropMenuEL.append(dropContentEl);
  dropEl.append(dropTrigEl, dropMenuEL);

  btnEl = $("<button>").addClass("button is-success").attr("id", "modal-submit")
  var iSpanEl = $("<span>").addClass("icon");
  var iconEl = $("<i>").addClass("fas fa-location-arrow").attr("aria-hidden", "true");
  var textSpanEl = $("<span>").text("Find Events");
  iSpanEl.append(iconEl);
  btnEl.append(iSpanEl, textSpanEl);

  $(".modal-content").append(dropEl, btnEl);
  //#endregion dropdown

  dropBtnEl.on("click", function(){
    dropEl.addClass("is-active");
  })

  btnEl.on("click", function () {
    cat = modalInput;
    modalInput = "";
    getCurrentPos(cat);
  });
}

document.querySelector("#get-events").addEventListener("click", function () {
  start();
});

$(".modal-close").on("click", toggleModal);
$(".modal-background").on("click", toggleModal);