axios.get('https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&dmaId=324&apikey=OWIi7laz1qDwxQmUKHndhZXCYa98oavA')
  .then(function (res){
    console.log(res);
  })
  .catch(function (err) {
    console.log(err);
});