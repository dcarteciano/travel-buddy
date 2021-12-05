var addButton = document.querySelector('#add-item');
var events = document.querySelector('#events');
var title = 'Event Title2';
var time = 'Start Time2';
var info = 'Event Info2';
var subInfo = 'Event Sub Info2: Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid hic nostrum at molestias dolores deserunt quidem pariatur similique';

function addListEl(title, time, info, subInfo) {

  addButton.addEventListener("click", function (){

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
    listEventTitle.addClass('title is-5').text(title).appendTo(listFirstColBox);
    var listEventTime = $('<p>');
    listEventTime.addClass('subtitle').text(time).appendTo(listFirstColBox);
    var listSecColEl = $('<div>');
    listSecColEl.addClass('column').appendTo(listColEl);
    var listSecColBox = $('<div>');
    listSecColBox.addClass('box').appendTo(listSecColEl);
    var listEventInfo = $('<p>');
    listEventInfo.addClass('title is-5').text(info).appendTo(listSecColBox);
    var listEventSubInfo = $('<p>');
    listEventSubInfo.addClass('subtitle').text(subInfo).appendTo(listSecColBox);
    
    listEl.appendTo(events);
    console.log("test");
  });
};

addListEl(title, time, info, subInfo);