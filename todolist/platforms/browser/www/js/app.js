// App logic.
window.myApp = {};

document.addEventListener('init', function(event) {
  var page = event.target;

  // Each page calls its own initialization controller.
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  }

  // Fill the lists with initial data when the pages we need are ready.
  // This only happens once at the beginning of the app.
  if (page.id === 'menuPage' || page.id === 'pendingTasksPage' || page.id === 'completedTasksPage' || page.id === 'waitingTasksPage' || page.id === 'expiredTasksPage') {
    if (document.querySelector('#menuPage')
      && document.querySelector('#pendingTasksPage') 
      && !document.querySelector('#pendingTasksPage ons-list-item')

      && document.querySelector('#completedTasksPage') 
      && !document.querySelector('#completedTasksPage ons-list-item')

      && document.querySelector('#waitingTasksPage') 
      && !document.querySelector('#waitingTasksPage ons-list-item')

      && document.querySelector('#expiredTasksPage') 
      && !document.querySelector('#expiredTasksPage ons-list-item')
    ) {
      myApp.services.fixtures.forEach(function(data) {
        myApp.services.tasks.create(data);
      });
    }
  }
});
