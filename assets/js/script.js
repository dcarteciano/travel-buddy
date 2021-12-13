var addButton = document.querySelector('#add-item');
var movies = document.querySelector('#movies');
var showtimesDiv = document.querySelector('#showtimes');
var currentLatitude;
var curentLongitude;
// last modal input, if value is needed elsewhere it should be stored in a separate var as a new input in modal will overwrite the var
var modelInput;

var johnClient = "UNIV_55";
var johnApiKey = "5SNa2JxuS81Ez99j1qXhA8bWvOiWsWjd14bJtU1T";
var johnAuth = "Basic VU5JVl81NTpMMzVtemRyenhUQ3Q=";

var darrylClient = "";
var darrylApiKey = "";
var darrylAuth = "";

var taylorClient = "UOFU";
var taylorApiKey = "EqH5eeXVDL5kz6Lnjuw5k3OXpx4JqAng4xCiay4l";
var taylorAuth = "Basic VU9GVTo0SFJrWTNQVlMzcTY=";

var currentDateUTC = moment().format();
var currentDate = moment().format('YYYY-MM-DD');
var filmsDate;

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
  $.ajax(films).done(function (res) {
    var filmsArray = res.films;
    console.log('filmsArray', filmsArray);
    buildFilmsList(filmsArray);
    storeFilmsArray(filmsArray);
  });

}
// function that stores the filmsArray into localstorage
function storeFilmsArray(filmsArray) {
  filmsDate = moment();
  localStorage.setItem('filmsArray', JSON.stringify(filmsArray));
  localStorage.setItem('filmsDate', JSON.stringify(filmsDate));
}


function buildFilmsList(filmsArray) {
  // takes the different objects of the event array and stores them to seperate variables
  for (var i = 0; i < filmsArray.length; i++) {
    var filmTitle = filmsArray[i].film_name;
    var filmID = filmsArray[i].film_id;
    var filmInfo = filmsArray[i].synopsis_long;
    var filmPoster = filmsArray[i].images.poster[1].medium.film_image;
    var filmTrailer = filmsArray[i].film_trailer;
    var filmIMDB = filmsArray[i].imdb_id;
    var filmRating = filmsArray[i].age_rating[0].rating;
    var filmRatingImage = filmsArray[i].age_rating[0].age_rating_image;
    var filmRatingAdvisory = filmsArray[i].age_rating[0].age_advisory;
    addMovieCards(filmTitle, filmInfo, filmPoster, filmID, filmTrailer, filmRating, filmRatingImage, filmRatingAdvisory)
  }
}

function addMovieCards(filmTitle, filmInfo, filmPoster, filmID, filmTrailer, filmRating, filmRatingImage, filmRatingAdvisory) {

  // var filmColumns = $('<div>');
  // filmColumns.addClass('columns is-mobile is-multiline is-centered');
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

  $('#' + filmID + 'poster').on("click", function () {
    console.log("movies display");
    $("#movies").hide();
    movies = '';
    getCurrentPos(filmID);

  });

  $('#' + filmID + 'info').on("click", function () {
    modal(filmTitle, filmInfo);
  });

  $('#' + filmID + 'rating').on("click", function () {
    modal('Rated ' + filmRating, filmRatingAdvisory, false, 'Close');
  });

}

function getCurrentPos(filmID) {

  currentLatitude = 0;
  curentLongitude = 0;

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

//filmGlu api to get showtimes for selected film nearby and long/lat
function getApi(filmID, currentLoc) {
  // create todays date and format like in line 129

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
  $.ajax(cinemas).done(function (response) {
    var cinemasArray = response.cinemas;
    console.log('cinemasArray', cinemasArray);
    buildList(cinemasArray, currentLoc);
  })
};

function buildList(cinemasArray, currentLoc) {
  // takes the different objects of the event array and stores them to seperate variables
  for (var i = 0; i < cinemasArray.length; i++) {
    var cinemaTitle = cinemasArray[i].cinema_name;
    var showtimes = cinemasArray[i].showings.Standard.times;
    var cinemaID = cinemasArray[i].cinema_id;
    addListEl(cinemaTitle, showtimes, cinemaID, currentLoc);
  }
}

function addListEl(cinemaTitle, showtimes, cinemaID, currentLoc) {

  // create a container for showtime

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

  console.log(showtimes);

  for (var i = 0; i < showtimes.length; i++) {
    var showtime = showtimes[i].start_time;
    showtime = moment(showtime, 'HH:mm').format('h:mm a');
    var showtimeButton = $('<button>');
    showtimeButton
      .addClass('button is-link m-1 p-2')
      .text(showtime)
      .attr('id', cinemaID + 'showtime' + i)
      .appendTo(listThirdColEl);

    $('#' + cinemaID + 'showtime' + i).on("click", function () {
      showtime = moment(showtime, 'h:mm a').calendar().format();
      console.log(showtime);
      getCinemaLocation(cinemaID, currentLoc, showtime);
    });

  }

  // listEl.appendTo(showtimesDiv);

  // var titleFixed = showtimeInfo.split(' ').join('+');
  // // https://www.google.com/maps/dir/40.4752752,-111.9263536/The+Depot/@40.6257634,-112.0496547,11
  // var listShowtimeDirections = $('<a>')
  //   .attr('href', 'https://www.google.com/maps/dir/' + from + '/' + titleFixed)
  //   .attr('target', '_blank')
  //   .addClass('button is-success mx-3')
  //   .text('Get Directions');
  // listShowtimeDirections.appendTo(listSecColBox);

};

function getCinemaLocation(cinemaID, currentLoc, showtime) {
  showtime = moment(showtime).calendar().format();
  // create todays date and format like in line 129
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
    },
  };
  console.log(cinema)
  $.ajax(cinema).done(function (response) {

    var cinemaLoc = response.lat + ',' + response.lng;
    console.log('Cinema Location', cinemaLoc);
    getMapData(currentLoc, cinemaLoc, showtime);

  })
};

// from and to can either be "lat,lon" or an adress
function getMapData(from, to, showtime) {
  axios.get('https://www.mapquestapi.com/directions/v2/route?key=diSZVTUqXE3YRm5IRyRe5IWmMHZWbypB&from=' + from + '&to=' + to + '')
    .then(function (res) {
      if (res.data.route.realTime > 0) {
        if (res.data.route.realTime < 10000000) {
          var leaveByTime = moment(showtime).subtract(res.data.route.realTime, 'seconds');
          // if realtime data is unavailable, returns calculated drivetime time in seconds
          if (moment(leaveByTime).isBefore()) {
            var difference = moment().duration(moment().diff(leaveByTime));
            var minutesLate = difference.asMinutes();
            console.log('showtime', showtime);
            console.log('leaveByTime', leaveByTime);
            console.log('minutesLate', minutesLate);
            console.log('res.data.route.realTime', res.data.route.realTime);
            modal('Can you make it?', 'No, you would be ' + minutesLate + 'late to the movie.', false, 'Choose another movie');
          } else {
            var difference = moment().duration(leaveByTime.diff(moment()));
            var minutesEarly = difference.asMinutes();
            console.log('showtime', showtime);
            console.log('leaveByTime', leaveByTime);
            console.log('minutesEarly', minutesEarly);
            console.log('res.data.route.realTime', res.data.route.realTime);
            modal('Can you make it?', 'Yes, you will be ' + minutesEarly + 'early to the movie.', false, 'Directions to cimena');
          }
        }
        else {
          var leaveByTime = moment(showtime).subtract(res.data.route.realTime, 'seconds');
          // if realtime data is unavailable, returns calculated drivetime time in seconds
          if (moment(leaveByTime).isBefore()) {
            var difference = moment().duration(moment().diff(leaveByTime));
            var minutesLate = difference.asMinutes();
            console.log('showtime', showtime);
            console.log('leaveByTime', leaveByTime);
            console.log('minutesLate', minutesLate);
            console.log('res.data.route.realTime', res.data.route.realTime);
            modal('Can you make it?', 'No, you would be ' + minutesLate + 'late to the movie.', false, 'Choose another movie');
          } else {
            var difference = moment().duration(leaveByTime.diff(moment()));
            var minutesEarly = difference.asMinutes();
            console.log('showtime', showtime);
            console.log('leaveByTime', leaveByTime);
            console.log('minutesEarly', minutesEarly);
            console.log('res.data.route.realTime', res.data.route.realTime);
            modal('Can you make it?', 'Yes, you will be ' + minutesEarly + 'early to the movie.', false, 'Directions to cimena');
          }
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


// modal use
// for a simple message use a string for title and info 
// for a form isForm needs to be true
function modal(title, info, btnText) {
  var modalContentEl = $("#modal-content");

  if (title === "Error") {
    modalContentEl.addClass("is-danger");
  }
  else {
    modalContentEl.addClass("is-success");
  }

  $("#modal-title").append($("<p>").text(title));
  $("#modal-info").text(info);

  if (btnText) {
    var modalFootEl = $("<footer>").addClass("modal-card-foot")
    var modalBtn = $("<button>").addClass("button is-success").attr("id", "modal-button").text(btnText);
    modalFootEl.append(modalBtn);
    modalContentEl.append(modalFootEl);
    modalBtn.on("click", function () {
      var btnVal = $(this).text();
      modalButtonHandler(btnVal);
    });
  }

  toggleModal();
}

function modalButtonHandler(text) {
  console.log("Modal Button Text: ", text);
  // example 

  // if(text === "your modal button text") {
  //   any code you want executed from button click
  // }

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

// document.querySelector("#get-events").addEventListener("click", function (filmsArray, currentDateUTC, currentDate) {
//   // When the show movies button is pressed the getFilms() function is called
//   getFilms();
//   // pulls the filmsArray from local storage and stores it into filmsArray varaible
//   filmsArray = localStorage.getItem('filmsArray')
//   // parsese the string back into an Array
//   filmsArray = JSON.parse(filmsArray)
//   // checks to see if there is something inside the filmsArray object in local storage
//   if (localStorage.getItem("filmsArray") === null) {
//     // if empty or nothing in storage, run getFilms
//     getFilms();
//   }
//   // if there is an object in localstorage compare the dates
//   else {
//     // declaration of the dates and puts it into a format to compare the day numbers
//     currentDateUTC = moment().format();
//     currentDate = moment().format('YYYY-MM-DD');
//     var d = new Date(currentDateUTC)
//     var c = new Date(currentDate);
//     // if the days are the same then returns films array
//     if (d.getDate() === c.getDate()) {
//       return filmsArray;
//       // if days are not the same then run getfilms function
//     } else {
//       getFilms();
//     }
//   }
// });


var filmsLoaded = false;
document.querySelector("#get-films").addEventListener("click", function () {
  moviesEl = $("#movies");
  // first click after page load checks for stored data
  if (!filmsLoaded) {

    // pulls the filmsArray from local storage and stores it into filmsArray varaible
    var filmsArray = localStorage.getItem('filmsArray');
    filmsDate = localStorage.getItem('filmsDate');
    // if there is data in the filmsArray
    if (filmsArray && filmsDate) {
      filmsDate = JSON.parse(filmsDate);
      console.log(filmsDate.date)
      if (moment(filmsDate).date() === moment().date()) {
        console.log("using stored list");
        filmsArray = JSON.parse(filmsArray); // parse the string into an Array
        filmsLoaded = true;
        buildFilmsList(filmsArray); // proceed to display films
      }
      else {
        filmsLoaded = true;
        console.log("getting new movies failed second check");
        getFilms(); // api call for films
      }
    }
    else {
      filmsLoaded = true;
      console.log("getting new movies failed 1rst check");
      getFilms(); // api call for films
    }
  }
  // if button is clicked again shows the movies available
  else {
    console.log("showing movie list");
    moviesEl.show();
    $("#showtimes").empty();
  }
});

$(".modal-background").on("click", toggleModal);
$("#modal-close").on("click", toggleModal);