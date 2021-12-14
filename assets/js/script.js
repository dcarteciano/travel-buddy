// Global Variables
var addButton = document.querySelector('#add-item');
var movies = document.querySelector('#movies');
var showtimesDiv = document.querySelector('#showtimes');
var currentLatitude;
var curentLongitude;
var currentLoc;
var currentDateUTC = moment().format();
var currentDate = moment().format('YYYY-MM-DD');
var filmsDate;

// last modal input, if value is needed elsewhere it should be stored in a separate var as a new input in modal will overwrite the var
var modelInput;

// API keys, because of the limits that these APIs put on us, we had to generate multiple keys to be able to keep using this app
var johnClient = "BYU";
var johnApiKey = "jKtK0wCFgQ617lSilFMPfYtV3ZUcbji6qaMn3ang";
var johnAuth = "Basic QllVOkxZOFlieUJLWjM3Zg==";

var darrylClient = "";
var darrylApiKey = "";
var darrylAuth = "";

var taylorClient = "UOFU";
var taylorApiKey = "EqH5eeXVDL5kz6Lnjuw5k3OXpx4JqAng4xCiay4l";
var taylorAuth = "Basic VU9GVTo0SFJrWTNQVlMzcTY=";

// First movieGlu api to get a list of movies that are currently playing in theaters
function getFilms() {
  var films = {
    "url": "https://api-gate2.movieglu.com/filmsNowShowing/?n=15",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "api-version": "v200",
      "client": johnClient,
      "x-api-key": johnApiKey,
      "authorization": johnAuth,
      "territory": "US",
      "device-datetime": currentDateUTC
    },
  };
  $.ajax(films)
    .done(function (res) {
      var filmsArray = res.films;
      console.log('filmsArray', filmsArray);
      buildFilmsList(filmsArray);
      // Stores this array in localStorage for repeated use in a single day
      storeFilmsArray(filmsArray);
    })
    .fail(function () {
      modal("Error", "We had trouble retrieving data from movieglu.com");
    })
};

// function that stores the filmsArray into localstorage
function storeFilmsArray(filmsArray) {
  filmsDate = moment();
  localStorage.setItem('filmsArray', JSON.stringify(filmsArray));
  localStorage.setItem('filmsDate', JSON.stringify(filmsDate));
}

function buildFilmsList(filmsArray) {
  // for loop to create a card for each movie
  for (var i = 0; i < filmsArray.length; i++) {
    // takes the different objects of the event array and stores them to seperate variables
    var filmTitle = filmsArray[i].film_name;
    var filmID = filmsArray[i].film_id;
    var filmInfo = filmsArray[i].synopsis_long;
    var filmPoster = filmsArray[i].images.poster[1].medium.film_image;
    var filmTrailer = filmsArray[i].film_trailer;
    // var filmIMDB = filmsArray[i].imdb_id;
    var filmRating = filmsArray[i].age_rating[0].rating;
    var filmRatingImage = filmsArray[i].age_rating[0].age_rating_image;
    var filmRatingAdvisory = filmsArray[i].age_rating[0].age_advisory;
    addMovieCards(filmTitle, filmInfo, filmPoster, filmID, filmTrailer, filmRating, filmRatingImage, filmRatingAdvisory)
  }
}

// function to build a movie card and append it to the DOM
function addMovieCards(filmTitle, filmInfo, filmPoster, filmID, filmTrailer, filmRating, filmRatingImage, filmRatingAdvisory) {

  // use the example in the html code to follow how it builds this list. 
  var filmColumn = $('<div>');
  filmColumn.addClass('column is-narrow');
  var cardDiv = $('<div>');
  cardDiv.addClass('card').attr('style', 'width: 200px').appendTo(filmColumn);
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
  cardTitle.addClass('content is-size-5 has-text-centered')
    .text(filmTitle)
    .appendTo(cardContentDiv);
  var cardIconSpan = $('<span>');
  cardIconSpan.addClass('icon').appendTo(cardTitle);
  var cardIcon = $('<i>');
  cardIcon.addClass('fas fa-info-circle')
    .attr('id', filmID + 'info')
    .attr('aria-hidden', 'true')
    .appendTo(cardIconSpan);
  var ratingFigure = $('<figure>');
  ratingFigure.addClass('image').appendTo(cardContentDiv);
  var ratingImage = $('<img>')
    .attr('src', filmRatingImage)
    .attr('alt', filmRating + 'Rating')
    .attr('id', filmID + 'rating')
    .attr('style', 'width: auto')
    .attr('style', 'height: 25px')
    .addClass('mx-auto mb-3');
  ratingImage.appendTo(cardContentDiv);
  var trailerButton = $('<a>')
    .attr('href', filmTrailer)
    .attr('target', '_blank')
    .addClass('button is-success mx-3')
    .text('Watch Trailer');
  trailerButton.appendTo(cardContentDiv);

  filmColumn.appendTo(movies);

  //event listener for the movie poster to get location and get showtimes for that specific movie
  $('#' + filmID + 'poster').on("click", function () {
    console.log("movies display");
    $("#movies").hide();
    movies = '';
    getCurrentPos(filmID);
  });

  //event listener for the synopsis for that specific movie
  $('#' + filmID + 'info').on("click", function () {
    modal(filmTitle, filmInfo);
  });

  //event listener for the rating explanation for that specific movie
  $('#' + filmID + 'rating').on("click", function () {
    modal('Rated ' + filmRating, filmRatingAdvisory, false, 'Close');
  });

}

// function to get the current location of user, uses GPS if on a mobile device
function getCurrentPos(filmID) {

  currentLatitude = 0;
  curentLongitude = 0;
  currentLoc = 0;

  // location is stored as a lat & long variable
  function success(position) {
    currentLatitude = position.coords.latitude;
    curentLongitude = position.coords.longitude;
    currentLoc = currentLatitude + ";" + curentLongitude;
    getApi(filmID, currentLoc);
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

// movieGlu api to get showtimes for selected film nearby by using the film ID# and long/lat
function getApi(filmID, currentLoc) {

  var cinemas = {
    "url": "https://api-gate2.movieglu.com/filmShowTimes/?film_id=" + filmID + "&date=" + currentDate + "&n=15",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "client": johnClient,
      "x-api-key": johnApiKey,
      "authorization": johnAuth,
      "territory": "US",
      "api-version": "v200",
      "geolocation": currentLoc,
      "device-datetime": currentDateUTC
    },
  };
  $.ajax(cinemas)
    .done(function (response) {
      var cinemasArray = response.cinemas;
      console.log('cinemasArray', cinemasArray);
      buildList(cinemasArray);
    })
    .fail(function () {
      modal("Error", "We had trouble retrieving data from movieglu.com");
    })
};

function buildList(cinemasArray) {
  // for loop to create a list item for each cinema
  for (var i = 0; i < cinemasArray.length; i++) {
    // takes the different objects of the event array and stores them to seperate variables
    var cinemaTitle = cinemasArray[i].cinema_name;
    var showtimes = cinemasArray[i].showings.Standard.times;
    var cinemaID = cinemasArray[i].cinema_id;
    addListEl(cinemaTitle, showtimes, cinemaID);
  }
}

// function to build a cinema list item and append it to the DOM
function addListEl(cinemaTitle, showtimes, cinemaID) {

  // use the example in the html code to follow how it builds this list. 
  var listElNot = $('<div>');
  listElNot.addClass('notification is-primary my-3').appendTo(showtimesDiv);
  var listNavEl = $('<nav>');
  listNavEl.addClass('columns level').appendTo(listElNot);

  var listFirstColEl = $('<div>');
  listFirstColEl.addClass('column is-one-third level-left').appendTo(listNavEl);
  var listFirstColItem = $('<div>');
  listFirstColItem.addClass('level-item py-1').attr('style', 'justify-content: left').appendTo(listFirstColEl);
  var listCinemaTitle = $('<p>');
  listCinemaTitle.addClass('is-size-4').text(cinemaTitle).appendTo(listFirstColItem);

  var listSecColEl = $('<div>');
  listSecColEl.addClass('column is-one-third level-center').appendTo(listNavEl);
  var listSecColItem = $('<div>');
  listSecColItem.addClass('level-item py-1').appendTo(listSecColEl);
  var listCinemaTitle = $('<p>');
  listCinemaTitle.addClass('is-size-5').text('Showtimes:').appendTo(listSecColItem);

  var listThirdColEl = $('<div>');
  listThirdColEl.addClass('column is-one-third level-right is-flex-wrap-wrap').appendTo(listNavEl);

  var showtimeArray = [];
  // for loop to create a button for each showtime for each theater
  for (var i = 0; i < showtimes.length; i++) {

    showtimeArray[i] = showtimes[i].start_time;
    showtimeText = moment(showtimeArray[i], 'HH:mm').format('h:mm a');
    var showtimeButton = $('<button>');
    showtimeButton
      .addClass('button is-link m-1 p-2')
      .text(showtimeText)
      .attr('id', cinemaID + 'showtime' + i)
      .appendTo(listThirdColEl);

    //event listener for each specific showtime specific to the cinema
    $('#' + cinemaID + 'showtime' + i).on("click", function () {
      var showtime = showtimeArray[i];
      console.log(showtime);
      var showtimeDay = moment().format('YYYY-MM-DD');
      showtime = showtimeDay + 'T' + showtime + ':00-00:00';
      showtime = moment(showtime).utc(showtime, 'YYYY-MM-DD[T]HH:mm[Z]');
      getCinemaLocation(cinemaID, showtime, cinemaTitle);
    });
  }
};

// movieGlu api to get the location for that specific cinema
function getCinemaLocation(cinemaID, showtime, cinemaTitle) {
  var cinema = {
    "url": "https://api-gate2.movieglu.com/cinemaDetails/?cinema_id=" + cinemaID,
    "method": "GET",
    "timeout": 0,
    "headers": {
      "client": johnClient,
      "x-api-key": johnApiKey,
      "authorization": johnAuth,
      "territory": "US",
      "api-version": "v200",
      "device-datetime": currentDateUTC
    },
  };
  // location is stored as a lat & long variable
  $.ajax(cinema).done(function (response) {
    var directionsLoc = currentLatitude + ',' + curentLongitude;
    var currentLocCinema = curentLongitude + '%2C' + currentLatitude;
    var cinemaLoc = response.lng + '%2C' + response.lat;
    getMapData(currentLocCinema, cinemaLoc, showtime, cinemaTitle, directionsLoc);

    })
    .fail(function () {
      modal("Error", "We had trouble retrieving data from movieglu.com");
    });
};

// MapBox api to get the driving time in minutes from your current location to the cinema's location
function getMapData(from, to, showtime, cinemaTitle, directionsLoc) {

  var directions = {
    'url': 'https://api.mapbox.com/directions/v5/mapbox/driving/' + from + '%3B'+ to + 
    '?alternatives=true&geometries=geojson&language=en&overview=simplified&steps=true&access_token=pk.eyJ1Ijoiam9obmRhdmlzOTI3OTAiLCJhIjoiY2t4NDZlNWJ5MjVoYjJucW9kcm5jdGQxZyJ9.1CTxHYCYILbYZTJvrvtwqw'
    };
  
  $.ajax(directions).done(function (res) {
    var duration = res.routes[0].duration / 60;
    duration = Math.round(duration);
    currentDateUTC = moment.utc(currentDateUTC, 'YYYY-MM-DD[T]HH:mm[Z]');
    //calculates arrival time by adding the driving time to the current time
    var arrivalTime = moment(currentDateUTC).add(duration, 'minutes');
    arrivalTime =  moment(arrivalTime).utc(arrivalTime, 'YYYY-MM-DD[T]HH:mm[Z]');
    console.log('currentDateUTC', currentDateUTC);
    console.log('showtime', showtime);
    console.log('duration', duration);
    console.log('arrivalTime', arrivalTime);
    if (duration > 0) {
      // if the arrival time is after the movie starts then it will calculate how many minutes you will be late
      if (moment(arrivalTime).isAfter(showtime)) {
        var minutesLate =  moment(arrivalTime).diff(showtime, 'minutes');
        if (minutesLate > 59){
          //converts the number of mins into hours and minutes if over an hour of time
          var hoursMins = timeConvert(minutesLate);
          console.log('minutesLate', minutesLate);
          //displays how many minutes you will be late by and gives you a button to get the driving directions in Google maps
          modal('Can we make it?', 'No, you would be ' + hoursMins + 
                ' late to the movie. Choose another showtime or click below if you still want to go', 
                'Directions to cinema', directionsLoc, cinemaTitle);
          duration = 0;
          arrivalTime = '';
          minutesLate = 0;
          hoursMins = '';
          showtime = '';
        } else if (minutesLate < 60){
          //displays how many minutes you will be late by and gives you a button to get the driving directions in Google maps
          console.log('minutesLate', minutesLate);
          modal('Can we make it?', 'No, you would be ' + minutesLate + 
                ' minutes late to the movie. Choose another showtime or click below if you still want to go', 
                'Directions to cinema', directionsLoc, cinemaTitle);
          duration = 0;
          arrivalTime = '';
          minutesLate = 0;  
          showtime = '';  
        } else if (minutesLate === 1){
          //displays how many minutes you will be late by and gives you a button to get the driving directions in Google maps
          console.log('minutesLate', minutesLate);
          modal('Can we make it?', 'No, you would be ' + minutesLate + 
                ' minute late to the movie. Choose another showtime or click below if you still want to go', 
                'Directions to cinema', directionsLoc, cinemaTitle);
          duration = 0;
          arrivalTime = '';
          minutesLate = 0;
          showtime = '';
        }
      } else {
        var minutesEarly =  moment(showtime).diff(arrivalTime, 'minutes');
        if (minutesEarly > 59){
          //converts the number of mins into hours and minutes if over an hour of time
          var hoursMins = timeConvert(minutesEarly);
          console.log('minutesEarly', minutesEarly);
          //displays how many minutes you will be early and gives you a button to get the driving directions in Google maps
          modal('Can we make it?', 'Yes, you will be ' + hoursMins + 
                ' early to the movie.', 
                'Directions to cinema', directionsLoc, cinemaTitle);
          duration = 0;
          arrivalTime = '';
          minutesEarly = 0;
          hoursMins = ''; 
          showtime = '';
        } else if (minutesEarly < 60){
          console.log('minutesEarly', minutesEarly);
          //displays how many minutes you will be early and gives you a button to get the driving directions in Google maps
          modal('Can we make it?', 'Yes, you will be ' + minutesEarly + 
                ' minutes early to the movie.', 
                'Directions to cinema', directionsLoc, cinemaTitle);
          duration = 0;
          arrivalTime = '';
          minutesEarly = 0;
          showtime = '';
        } else if (minutesEarly === 1){
          console.log('minutesEarly', minutesEarly);
          //displays how many minutes you will be early and gives you a button to get the driving directions in Google maps
          modal('Can we make it?', 'Yes, you will be ' + minutesEarly + 
                ' minute early to the movie.', 
                'Directions to cinema', directionsLoc, cinemaTitle);
          duration = 0;
          arrivalTime = '';
          minutesEarly = 0;
          showtime = '';
        }
      }
    }
    else {
      modal("Error", "Could not find route between given locations");
    }
  });
}

//converts a number of mins into hours and minutes if over an hour of time
function timeConvert(n) {
  var num = n;
  var hours = (num / 60);
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  if (rhours > 1 && rminutes > 1){
    return rhours + " hours and " + rminutes + " minutes";
  } else if (rhours > 1 && rminutes === 1){
    return rhours + " hours and " + rminutes + " minute";
  } else if (rhours === 1 && rminutes === 1){
    return rhours + " hour and " + rminutes + " minute";
  } else if (rhours === 1 && rminutes > 1){
    return rhours + " hour and " + rminutes + " minutes";
  } else if (rhours > 1 && rminutes === 0){
    return rhours + " hours";
  } else if (rhours === 1 && rminutes === 0){
    return rhours + " hour";
  }
}

// modal use
// for a simple message use a string for title and info 
// add if statement in modalButtonHandler if using btnText
function modal(title, info, btnText, from, cinemaTitle) {
  var modalContentEl = $("#modal-content");

  // styles
  if (title === "Error") {
    modalContentEl.addClass("is-danger");
  }
  else {
    modalContentEl.addClass("is-success");
  }

  // text elements
  $("#modal-title").append($("<p>").text(title));
  $("#modal-info").text(info);

  // optional functionality
  if (btnText) {
    var titleFixed = cinemaTitle.split(' ').join('+');
    var modalFootEl = $("<footer>").addClass("modal-card-foot")
    var modalBtn = $("<a>")
    .addClass("button is-success")
    .attr("id", "modal-button")
    .text(btnText)
    .attr('href', 'https://www.google.com/maps/dir/' + from + '/' + titleFixed)
    .attr('target', '_blank')
    modalFootEl.append(modalBtn);
    modalContentEl.append(modalFootEl);
  }
  toggleModal();
}

// auto called in modal, needs to be called if customizing modal structure dynamically 
function toggleModal() {
  var display = $(".modal");
  if (display.hasClass("is-active")) {
    display.removeClass("is-active");
    $("#modal-content").removeClass("is-success is-warning is-danger");
    $("#modal-title").empty();
    $("#modal-info").empty();
    $(".modal-card-foot").remove();
  }
  else {
    display.addClass("is-active");
  }
}

// Event listener to start application
var filmsLoaded = false;
document.querySelector("#get-films").addEventListener("click", function () {
  moviesEl = $("#movies");
  // first click after page load checks for stored data
  if (!filmsLoaded) {

    // pulls the filmsArray from local storage and stores it into filmsArray varaible
    var filmsArray = localStorage.getItem('filmsArray');
    filmsDate = localStorage.getItem('filmsDate');
    // checks if there is data in the films and filmsdate array
    if (filmsArray && filmsDate) {
      filmsDate = JSON.parse(filmsDate);
      // checks if todays date matches the stored date
      if (moment(filmsDate).date() === moment().date()) {
        console.log("using stored list");
        filmsArray = JSON.parse(filmsArray); // parse the string into an Array
        filmsLoaded = true; // next time this button is clicked it will toggle the movies list
        buildFilmsList(filmsArray); // proceed to display films
      }
      // if dates weren't a match
      else {
        filmsLoaded = true;
        console.log("getting new movies failed 2nd check");
        getFilms(); // api call for films
      }
    }
    // if no data found in storage
    else {
      filmsLoaded = true;
      console.log("getting new movies failed 1rst check");
      getFilms(); // api call for films
    }
  }
  // if button is clicked again it brings the movie list up
  else {
    console.log("showing movie list");
    moviesEl.show();
    $("#showtimes").empty();
  }
});

$(".modal-background").on("click", toggleModal);
$("#modal-close").on("click", toggleModal);