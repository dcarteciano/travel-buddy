// axios.get('https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&dmaId=324&apikey=OWIi7laz1qDwxQmUKHndhZXCYa98oavA')
//   .then(function (res){
//     console.log(res);
//   })
//   .catch(function (err) {
//     console.log(err);
// });

// function that displays the events from the API
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
});


}

getApi();