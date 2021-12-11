var addButton = document.querySelector('#add-item');
var events = document.querySelector('#events');
var movies = document.querySelector('#movies');
var currentLatitude;
var curentLongitude;
// last modal input, if value is needed elsewhere it should be stored in a separate var as a new input in modal will overwrite the var
var modelInput;

function getFilms() {
  var films = {
    "url": "https://api-gate2.movieglu.com/filmsNowShowing/?n=15",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "client": "PERS_101",
      "x-api-key": "td2siOlX5g1hBiJBvMmef8Bn5OhuWPhP8oXcEvW7",
      "authorization": "Basic UEVSU18xMDE6RDl6OUVCdjc1MGtz",
      "territory": "US",
      "api-version": "v200",
      "geolocation": "40.4896;-111.9400",
      "device-datetime": "2021-12-10T15:43:20+0000",
    },
    };
  $.ajax(films).done(function (res) {
    var filmsArray = res.films;
    console.log('filmsArray', filmsArray);
    buildFilmsList(filmsArray);
  });

};

function buildFilmsList(filmsArray) {
  // takes the different objects of the event array and stores them to seperate variables
  for (var i = 0; i < filmsArray.length; i++) {
    var filmTitle = filmsArray[i].film_name;
    var filmID = filmsArray[i].film_id;
    var filmInfo = filmsArray[i].synopsis_long;
    var filmPoster = filmsArray[i].images.poster[1].medium.film_image;
    var filmTrailer = filmsArray[i].film_trailer;
    var filmIMDB = filmsArray[i].imdb_id;
    var filmRatingImage = filmsArray[i].age_rating[0].age_rating_image;
    addMovieCards(filmTitle, filmInfo, filmPoster, filmID, filmTrailer)
  }
}

function addMovieCards(filmTitle, filmInfo, filmPoster, filmID, filmTrailer){

  var filmColumns = $('<div>');
  filmColumns.addClass('column is-narrow');
  var cardDiv = $('<div>');
  cardDiv.addClass('card').attr('style', 'width: 200px');
  var cardImageDiv = $('<div>');
  cardImageDiv.addClass('card-image').appendTo(cardDiv);
  var cardImageFigure = $('<figure>');
  cardImageFigure.addClass('image is-200x300').appendTo(cardImageDiv);
  var cardImg = $('<img>');
  cardImg.attr('src', filmPoster)
    .attr('alt', filmTitle)
    .attr('id', filmID + 'poster')
    .appendTo(cardImageFigure);
  var cardContentDiv = $('<div>');
  cardContentDiv.addClass('card-content').appendTo(cardDiv);
  var cardTitle = $('<p>');
  cardTitle.addClass('content')
    .text(filmTitle)
    .appendTo(cardContentDiv);
  var cardIconSpan = $('<span>');
  cardIconSpan.addClass('icon').appendTo(cardTitle);
  var cardIcon = $('<i>');
  cardIcon.addClass('fas fa-info-circle')
    .attr('id', filmID + 'info')
    .appendTo(cardIconSpan);
  var trailerButton = $('<a>')
    .attr('href', filmTrailer)
    .attr('target', '_blank')
    .addClass('button is-success mx-3')
    .text('Watch Trailer');
    trailerButton.appendTo(cardContentDiv);


  cardDiv.appendTo(filmColumns);
  filmColumns.appendTo(movies);

  $('#' + filmID + 'poster').on("click", function () {
    getCurrentPos(filmID);
  });

  $('#' + filmID + 'info').on("click", function () {
    modal(filmTitle, filmInfo, false, 'Close');
  });
  
}

function getCurrentPos(filmID) {
  currentLatitude = 0;
  curentLongitude = 0;

  function success(position) {
    currentLatitude = position.coords.latitude;
    curentLongitude = position.coords.longitude;
    getApi(filmID, currentLatitude, curentLongitude);
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

//filmGlu api to get showtimes for selected film nearby and long/lat
function getApi() {
  var showtimes = {
  "url": "https://api-gate2.movieglu.com/filmShowTimes/?film_id=315323&date=2021-12-10&n=15",
  "method": "GET",
  "timeout": 0,
  "headers": {
    "client": "PERS_101",
    "x-api-key": "td2siOlX5g1hBiJBvMmef8Bn5OhuWPhP8oXcEvW7",
    "authorization": "Basic UEVSU18xMDE6RDl6OUVCdjc1MGtz",
    "territory": "US",
    "api-version": "v200",
    "geolocation": "40.4896;-111.9400",
    "device-datetime": "2021-12-10T15:43:20+0000",
  },
};
console.log(showtimes)
  $.ajax(showtimes).done(function (response) {
    
    var showtimeArray = response.cinemas
    console.log('showtimes', showtimeArray);
    buildList(showtimeArray)
    
  })
};
  
getApi();

function buildList(showtimeArray) {
  // takes the different objects of the event array and stores them to seperate variables
  for (var i = 0; i < showtimeArray.length; i++) {
    var eventTitle = showtimeArray[i].name;
    var eventTime = showtimeArray[i].dates.start.dateTime;
    var eventInfo = showtimeArray[i]._embedded.venues[0].name;
    var eventURL = showtimeArray[i].url;
    var eventSubInfo = showtimeArray[i].pleaseNote;
    var eventLat = showtimeArray[i]._embedded.venues[0].location.latitude;
    var eventLong = showtimeArray[i]._embedded.venues[0].location.longitude;
    var eventPhoto = showtimeArray[i].images[0].url;
    getMapData(currentLatitude + ',' + curentLongitude, eventLat + ',' + eventLong,
      eventTitle, eventTime, eventInfo, eventSubInfo, eventURL, eventPhoto);
  }
}

// from and to can either be "lat,lon" or an adress
function getMapData(from, to, eventTitle, eventTime, eventInfo, eventSubInfo, eventURL, eventPhoto) {
  axios.get('https://www.mapquestapi.com/directions/v2/route?key=diSZVTUqXE3YRm5IRyRe5IWmMHZWbypB&from=' + from + '&to=' + to + '')
    .then(function (res) {
      if (res.data.route.realTime > 0) {
        if (res.data.route.realTime < 10000000) {
          var leaveByTime = moment(eventTime).subtract(res.data.route.realTime, 'seconds');
          // returns drivetime data in seconds based off of realtime traffic conditions
          addListEl(from, to, eventTitle, eventTime, eventInfo, eventSubInfo, leaveByTime, eventURL, eventPhoto);
        }
        else {
          var leaveByTime = moment(eventTime).subtract(res.data.route.realTime, 'seconds');
          // if realtime data is unavailable, returns calculated drivetime time in seconds
          addListEl(from, to, eventTitle, eventTime, eventInfo, eventSubInfo, leaveByTime, eventURL, eventPhoto);
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



function addListEl(from, to, eventTitle, eventTime, eventInfo, eventSubInfo, leaveByTime, eventURL, eventPhoto) {

  eventTime = moment(eventTime).format('MMMM Do YYYY, h:mma');
  leaveByTime = moment(leaveByTime).format('h:mma');

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
  var listEventTime = $('<p>');
  listEventTime.addClass('title is-6 has-text-right').text(eventTime).appendTo(listFirstColBox);
  var listEventDriveTime = $('<p>');
  listEventDriveTime.addClass('title is-6 has-text-right').text('Leave by ' + leaveByTime).appendTo(listFirstColBox);

  var listSecColEl = $('<div>');
  listSecColEl.addClass('column').appendTo(listColEl);
  var listSecColBox = $('<div>');
  listSecColBox.addClass('box').appendTo(listSecColEl);
  var listEventInfo = $('<p>');
  listEventInfo.addClass('title is-5').text(eventInfo).appendTo(listSecColBox);
  var listEventNote = $('<p>');
  listEventNote.addClass('is-size-6').text(eventSubInfo).appendTo(listSecColBox);
  var listEventNoteSpace = $('<br>');
  listEventNoteSpace.addClass('is-size-6').appendTo(listSecColBox);

  var listEventSubInfo = $('<a>')
    .attr('href', eventURL)
    .attr('target', '_blank')
    .addClass('button is-success mx-3')
    .text('Get Tickets');
  listEventSubInfo.appendTo(listSecColBox);

  var titleFixed = eventInfo.split(' ').join('+');
  // https://www.google.com/maps/dir/40.4752752,-111.9263536/The+Depot/@40.6257634,-112.0496547,11
  var listEventDirections = $('<a>')
    .attr('href', 'https://www.google.com/maps/dir/' + from + '/' + titleFixed)
    .attr('target', '_blank')
    .addClass('button is-success mx-3')
    .text('Get Directions');
  listEventDirections.appendTo(listSecColBox);

  var listEventPhotoFigure = $('<figure>');
  listEventPhotoFigure.addClass('image is-16by9');
  var listEventPhoto = $('<img>');
  listEventPhoto.attr('src', eventPhoto);
  listEventPhoto.appendTo(listEventPhotoFigure);
  listEventPhotoFigure.appendTo(listSecColBox);

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



document.querySelector("#get-events").addEventListener("click", function () {
  getFilms();
});

$(".modal-close").on("click", toggleModal);
$(".modal-background").on("click", toggleModal);