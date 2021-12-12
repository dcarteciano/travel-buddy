var addButton = document.querySelector('#add-item');
var movies = document.querySelector('#movies');
var showtimes = document.querySelector('#showtimes');
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
      "x-api-key": "5SNa2JxuS81Ez99j1qXhA8bWvOiWsWjd14bJtU1T",
      "authorization": "Basic VU5JVl81NTpMMzVtemRyenhUQ3Q=",
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
    var filmRating = filmsArray[i].age_rating[0].rating;
    var filmRatingImage = filmsArray[i].age_rating[0].age_rating_image;
    var filmRatingAdvisory = filmsArray[i].age_rating[0].age_advisory;
    addMovieCards(filmTitle, filmInfo, filmPoster, filmID, filmTrailer, filmRating, filmRatingImage, filmRatingAdvisory)
  }
}

function addMovieCards(filmTitle, filmInfo, filmPoster, filmID, filmTrailer, filmRating, filmRatingImage, filmRatingAdvisory){

  var filmColumns = $('<div>');
  filmColumns.addClass('columns is-mobile is-multiline is-centered');
  var filmColumn = $('<div>');
  filmColumn.addClass('column is-narrow');
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
    .attr('style', 'width: auto; height: 25px')
    .addClass('mx-auto mb-3');
  ratingImage.appendTo(cardContentDiv);
  var trailerButton = $('<a>')
    .attr('href', filmTrailer)
    .attr('target', '_blank')
    .addClass('button is-success mx-3')
    .text('Watch Trailer');
  trailerButton.appendTo(cardContentDiv);

  cardDiv.appendTo(filmColumns);
  filmColumn.appendTo(filmColumns);
  filmColumns.appendTo(movies);

  $('#' + filmID + 'poster').on("click", function () {
    getCurrentPos(filmID);
  });

  $('#' + filmID + 'info').on("click", function () {
    modal(filmTitle, filmInfo, false, 'Close');
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
function getApi(filmID, currentLatitude, curentLongitude) {
  // create todays date and format like in line 129
  var showtimes = {
  "url": "https://api-gate2.movieglu.com/filmShowTimes/?film_id=" + filmID + "&date=2021-12-10&n=15",
  "method": "GET",
  "timeout": 0,
  "headers": {
    "client": "PERS_101",
    "x-api-key": "td2siOlX5g1hBiJBvMmef8Bn5OhuWPhP8oXcEvW7",
    "authorization": "Basic UEVSU18xMDE6RDl6OUVCdjc1MGtz",
    "territory": "US",
    "api-version": "v200",
    "geolocation": currentLatitude + ";" + currentLongitude,
    "device-datetime": "2021-12-10T15:43:20+0000", //moment().format()
  },
};
console.log(showtimes)
  $.ajax(showtimes).done(function (response) {
    
    var showtimeArray = response.cinemas
    console.log('showtimes', showtimeArray);
    buildList(showtimeArray)
    
  })
};

function buildList(showtimeArray) {
  // takes the different objects of the event array and stores them to seperate variables
  for (var i = 0; i < showtimeArray.length; i++) {
    var cinemaTitle = showtimeArray[i].cinema_name;
    var showtimeTimes = showtimeArray[i].showings.Standard.times;
    var cinemaID = showtimeArray[i].cinema_id;
    addListEl(cinemaTitle, showtimeTimes, cinemaID);
  }
}

function addListEl(cinemaTitle, showtimeTimes, cinemaID) {

  

  // create a container for showtime
  var listEl = $('<div>');
  listEl.addClass('container is-max-desktop').attr('id', 'showtimes');
  var listElNot = $('<div>');
  listElNot.addClass('notification is-primary my-3').appendTo(listEl);
  var listNavEl = $('<nav>');
  listNavEl.addClass('columns level').appendTo(listElNot);

  var listFirstColEl = $('<div>');
  listFirstColEl.addClass('column is-one-third level-left').appendTo(listNavEl);
  var listFirstColItem = $('<div>');
  listFirstColItem.addClass('level-item py-1').appendTo(listFirstColEl);
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

  for (var i = 0; i < showtimeTimes.length; i++) {
    var showtimeTime = showtimeTimes[i].start_time;
    showtimeTime = moment(showtimeTime).format('h:mma');
    var listShowtime = $('<button>');
    listShowtime
      .addClass('button is-link m-1 p-2')
      .text(showtimeTime)
      .attr('id', cinemaID + 'showtime' + '#' + i)
      .appendTo(listThirdColItem);

    $('#' + cinemaID + 'showtime' + '#' + i).on("click", function () {
      getCinemaLocation(cinemaID, currentLoc, showtimeTime);
    });
    
  }
  

  listEl.appendTo(showtimes);

  // var titleFixed = showtimeInfo.split(' ').join('+');
  // // https://www.google.com/maps/dir/40.4752752,-111.9263536/The+Depot/@40.6257634,-112.0496547,11
  // var listShowtimeDirections = $('<a>')
  //   .attr('href', 'https://www.google.com/maps/dir/' + from + '/' + titleFixed)
  //   .attr('target', '_blank')
  //   .addClass('button is-success mx-3')
  //   .text('Get Directions');
  // listShowtimeDirections.appendTo(listSecColBox);

};

function getCinemaLocation(cinemaID, currentLoc, startTime) {
  // create todays date and format like in line 129
  var cinema = {
  "url": "https://api-gate2.movieglu.com/cinemaDetails/?cinema_id=" + cinemaID,
  "method": "GET",
  "timeout": 0,
  "headers": {
    "client": "PERS_101",
    "x-api-key": "td2siOlX5g1hBiJBvMmef8Bn5OhuWPhP8oXcEvW7",
    "authorization": "Basic UEVSU18xMDE6RDl6OUVCdjc1MGtz",
    "territory": "US",
    "api-version": "v200",
  },
};
console.log(cinema)
  $.ajax(cinema).done(function (response) {
    
    var cinemaLoc = response.lat + ',' + response.lng;
    console.log('Cinema Location', cinemaLoc);
    getMapData(currentLoc, cinemaLoc, startTime);
    
  })
};

// from and to can either be "lat,lon" or an adress
function getMapData(from, to, startTime) {
  axios.get('https://www.mapquestapi.com/directions/v2/route?key=diSZVTUqXE3YRm5IRyRe5IWmMHZWbypB&from=' + from + '&to=' + to + '')
    .then(function (res) {
      if (res.data.route.realTime > 0) {
        if (res.data.route.realTime < 10000000) {
          var leaveByTime = moment(startTime).subtract(res.data.route.realTime, 'seconds');
          // if realtime data is unavailable, returns calculated drivetime time in seconds
          if (moment(leaveByTime).isBefore()){
            var difference = moment.duration(moment().diff(leaveByTime));
            var minutesLate = difference.asMinutes();
            console.log('startTime', startTime);
            console.log('leaveByTime', leaveByTime);
            console.log('minutesLate', minutesLate);
            console.log('res.data.route.realTime', res.data.route.realTime);
            modal('Can you make it?', 'No, you would be ' + minutesLate + 'late to the movie.', false, 'Choose another movie');
          } else {
            var difference = moment.duration(leaveByTime.diff(moment()));
            var minutesEarly = difference.asMinutes();
            console.log('startTime', startTime);
            console.log('leaveByTime', leaveByTime);
            console.log('minutesEarly', minutesEarly);
            console.log('res.data.route.realTime', res.data.route.realTime);
            modal('Can you make it?', 'Yes, you will be ' + minutesEarly + 'early to the movie.', false, 'Directions to cimena');
          }
        }
        else {
          var leaveByTime = moment(startTime).subtract(res.data.route.realTime, 'seconds');
          // if realtime data is unavailable, returns calculated drivetime time in seconds
          if (moment(leaveByTime).isBefore()){
            var difference = moment.duration(moment().diff(leaveByTime));
            var minutesLate = difference.asMinutes();
            console.log('startTime', startTime);
            console.log('leaveByTime', leaveByTime);
            console.log('minutesLate', minutesLate);
            console.log('res.data.route.realTime', res.data.route.realTime);
            modal('Can you make it?', 'No, you would be ' + minutesLate + 'late to the movie.', false, 'Choose another movie');
          } else {
            var difference = moment.duration(leaveByTime.diff(moment()));
            var minutesEarly = difference.asMinutes();
            console.log('startTime', startTime);
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