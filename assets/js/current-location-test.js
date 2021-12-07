function geoFindMe() {

  const status = document.querySelector('#status');
  const mapLink = document.querySelector('#map-link');

  mapLink.href = '';
  mapLink.textContent = '';

  function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = '';
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = `${latitude},${longitude}`;
    //-----

    
    var requestUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&dmaId=324&apikey=OWIi7laz1qDwxQmUKHndhZXCYa98oavA';
    fetch(requestUrl)
    .then(function (response){
      return response.json();
    })
    .then(function (data) {

      var eventArray = data._embedded.events;

      for (var i = 0; i < eventArray.length; i++) {
        var eventLong = eventArray[i]._embedded.venues[0].location.longitude;
        var eventLat = eventArray[i]._embedded.venues[0].location.latitude;
        console.log(eventLat)
        console.log(true)
        // if (latitude < eventLat++ && latitude > eventLat--) {
          
        // } else {
        //   var response = "no events"

        // }


        // if(longitude > eventLong++ && longitude < eventLong--){

        //   console.log('yes')

        // }

      }




      



  });

  }

  function error() {
    status.textContent = 'Unable to retrieve your location';
  }

  if(!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
  } else {
    status.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(success, error);
  }
// ticket master api to get events nearby and long/lat
  function getApi() { 
    var requestUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&dmaId=324&apikey=OWIi7laz1qDwxQmUKHndhZXCYa98oavA';
    fetch(requestUrl)
    .then(function (response){
      return response.json();
    })
    .then(function (data) {
      console.log(data);
  
      var eventArray = data._embedded.events;
      console.log(eventArray)
  
  
      for (var i = 0; i < eventArray.length; i++) {
        var eventInfo = document.getElementById("event")
        eventInfo.textContent += eventArray[i].name;
      }
      for (var i = 0; i < eventArray.length; i++) {
        var eventLong = eventArray[i]._embedded.venues[0].location.longitude;
        var eventLat = eventArray[i]._embedded.venues[0].location.latitude;


      }

  });
  
  
  }
  
  getApi();

}


document.querySelector('#find-me').addEventListener('click', geoFindMe);








