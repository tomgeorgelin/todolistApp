/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

  /////////////////
  // Task Service //
  /////////////////
  tasks: {

    // Creates a new task and attaches it to the pending task list.
    create: function(data) {
      // Task item template.
      var taskItem = ons.createElement(
        '<ons-list-item tappable category="' + myApp.services.categories.parseId(data.category)+ '">' +
          '<div class="left waiting-task">' +
           //'<ons-icon style="color: grey; padding-left: 4px" icon="ion-ios-trash-outline, material:md-hourglass-outline"></ons-icon>' +
           '<ons-icon style="color: grey; padding-left: 4px" icon=""></ons-icon>' +
          '</div>' +
          '<div class="left check-task">' +
           '<ons-icon style="color: grey; padding-left: 4px" icon=""></ons-icon>' +
          '</div>' +
          '<div class="center">' +
            data.title +
          '</div>' +
          '<div class="right">' +
            '<ons-icon style="color: grey; padding-left: 4px" icon="ion-ios-trash-outline, material:md-delete"></ons-icon>' +
          '</div>' +
        '</ons-list-item>'
      );

      // Store data within the element.
      taskItem.data = data;
      taskItem.addEventListener('change', taskItem.data.onCheckboxChange);
      var listId;
      taskItem.querySelector('.waiting-task').onclick = function() {
        if(taskItem.data.done != 3) {
          myApp.services.animators.swipe(taskItem, function() {
            if (taskItem.data.done == 0) {
              listId = '#waiting-list';
              taskItem.data.done=1;
              myApp.controllers.changeStateTask(taskItem.data);
              document.querySelector(listId).appendChild(taskItem);
              taskItem.querySelector(".waiting-task ons-icon").setAttribute("icon", "material:md-replay");
              taskItem.querySelector(".waiting-task ons-icon").classList = "ons-icon zmdi zmdi-replay";
              taskItem.querySelector(".check-task ons-icon").setAttribute("icon", "material:md-check");
              taskItem.querySelector(".check-task ons-icon").classList = "ons-icon zmdi zmdi-check";
            }
            else if (taskItem.data.done == 1 || taskItem.data.done == 2) {
              listId = '#pending-list';
              taskItem.data.done=0;
              myApp.controllers.changeStateTask(taskItem.data);
              document.querySelector(listId).appendChild(taskItem);
              taskItem.querySelector(".waiting-task ons-icon").setAttribute("icon", "material:md-hourglass-outline");
              taskItem.querySelector(".waiting-task ons-icon").classList = "ons-icon zmdi zmdi-hourglass-outline";
              taskItem.querySelector(".check-task ons-icon").setAttribute("icon", "material:md-check");
              taskItem.querySelector(".check-task ons-icon").classList = "ons-icon zmdi zmdi-check";
            }
          });

        }
			};

			taskItem.querySelector('.check-task').onclick = function() {
        if(taskItem.data.done != 3) {
  			  myApp.services.animators.swipe(taskItem, function() {
  			    var listId;// = taskItem.data.done;
  			    if (taskItem.data.done == 0 || taskItem.data.done == 1) {
  			      listId = '#completed-list';
  			      taskItem.data.done=2;
              taskItem.querySelector(".waiting-task ons-icon").setAttribute("icon", "material:md-replay");
              taskItem.querySelector(".waiting-task ons-icon").classList = "ons-icon zmdi zmdi-replay";
              taskItem.querySelector(".check-task ons-icon").setAttribute("icon", "material:md-hourglass-outline");
              taskItem.querySelector(".check-task ons-icon").classList = "ons-icon zmdi zmdi-hourglass-outline";
  			    } 
  			    else if (taskItem.data.done == 2){
  			    	listId = '#waiting-list';
  			    	taskItem.data.done=1;
              taskItem.querySelector(".waiting-task ons-icon").setAttribute("icon", "material:md-replay");
              taskItem.querySelector(".waiting-task ons-icon").classList = "ons-icon zmdi zmdi-replay";
              taskItem.querySelector(".check-task ons-icon").setAttribute("icon", "material:md-check");
              taskItem.querySelector(".check-task ons-icon").classList = "ons-icon zmdi zmdi-check";
  			    }
  			    myApp.controllers.changeStateTask(taskItem.data);
  			    document.querySelector(listId).appendChild(taskItem);
  			  });
        }
			};
      // Add button functionality to remove a task.
      taskItem.querySelector('.right').onclick = function() {
        myApp.services.tasks.remove(taskItem);
        myApp.controllers.remove(taskItem.data);
      };

      // Add functionality to push 'details_task.html' page with the current element as a parameter.
      taskItem.querySelector('.center').onclick = function() {
        document.querySelector('#myNavigator')
          .pushPage('html/details_task.html',
            {
              animation: 'lift',
              data: {
                element: taskItem
              }
            }
          );
      };

      // Check if it's necessary to create new categories for this item.
      myApp.services.categories.updateAdd(taskItem.data.category);

      // Add the highlight if necessary.
      if (taskItem.data.highlight) {
        taskItem.classList.add('highlight');
      }
      let date = new Date();date.setDate(date.getDate() - 1);

      if (new Date(taskItem.data.date) - date< 0) {
        taskItem.data.done = 3; 
        myApp.controllers.changeStateTask(taskItem.data);
        var expiredList = document.querySelector('#expired-list');
        expiredList.insertBefore(taskItem, taskItem.data.urgent ? expiredList.firstChild : null);

      }
      // Insert urgent tasks at the top and non urgent tasks at the bottom.
      else if (taskItem.data.done==0) {
        taskItem.querySelector(".waiting-task ons-icon").setAttribute("icon", "material:md-hourglass-outline");
        taskItem.querySelector(".waiting-task ons-icon").classList = "ons-icon zmdi zmdi-hourglass-outline";
        taskItem.querySelector(".check-task ons-icon").setAttribute("icon", "material:md-check");
        taskItem.querySelector(".check-task ons-icon").classList = "ons-icon zmdi zmdi-check";
        var pendingList = document.querySelector('#pending-list');
        pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
      }
      else if (taskItem.data.done==1) {
        taskItem.querySelector(".waiting-task ons-icon").setAttribute("icon", "material:md-replay");
        taskItem.querySelector(".waiting-task ons-icon").classList = "ons-icon zmdi zmdi-replay";
        taskItem.querySelector(".check-task ons-icon").setAttribute("icon", "material:md-check");
        taskItem.querySelector(".check-task ons-icon").classList = "ons-icon zmdi zmdi-check";
        var pendingList = document.querySelector('#waiting-list');
        pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
      }
      else if (taskItem.data.done==2) {
        taskItem.querySelector(".waiting-task ons-icon").setAttribute("icon", "material:md-replay");
        taskItem.querySelector(".waiting-task ons-icon").classList = "ons-icon zmdi zmdi-replay";
        taskItem.querySelector(".check-task ons-icon").setAttribute("icon", "material:md-hourglass-outline");
        taskItem.querySelector(".check-task ons-icon").classList = "ons-icon zmdi zmdi-hourglass-outline";
        var completedList = document.querySelector('#completed-list');
        completedList.insertBefore(taskItem, taskItem.data.urgent ? completedList.firstChild : null);
      }
    },

    // Modifies the inner data and current view of an existing task.
    update: function(taskItem, data) {
      if (data.title !== taskItem.data.title) {
        // Update title view.
        taskItem.querySelector('.center').innerHTML = data.title;
      }


      if (data.category !== taskItem.data.category) {
        // Modify the item before updating categories.
        taskItem.setAttribute('category', data.category);
        // Check if it's necessary to create new categories.
        myApp.services.categories.updateAdd(data.category);
        // Check if it's necessary to remove empty categories.
        myApp.services.categories.updateRemove(taskItem.data.category);

      }

      // Add or remove the highlight.
      taskItem.classList[data.highlight ? 'add' : 'remove']('highlight');

      // Store the new data within the element.
      taskItem.data = data;
    },

    // Deletes a task item and its listeners.
    remove: function(taskItem) {
      taskItem.removeEventListener('change', taskItem.data.onCheckboxChange);
      myApp.services.animators.remove(taskItem, function() {
        // Remove the item before updating the categories.
        taskItem.remove();
        // Check if the category has no items and remove it in that case.
        myApp.services.categories.updateRemove(taskItem.data.category);
      });
    }
  },

  /////////////////////
  // Category Service //
  ////////////////////
  categories: {

    // Creates a new category and attaches it to the custom category list.
    create: function(categoryLabel) {
      var categoryId = myApp.services.categories.parseId(categoryLabel);

      myApp.controllers.addCategory(categoryId);

      // Category item template.
      var categoryItem = ons.createElement(
        '<ons-list-item tappable category-id="' + categoryId + '">' +
          '<div class="left">' +
            '<ons-radio name="categoryGroup" input-id="radio-'  + categoryId + '"></ons-radio>' +
          '</div>' +
          '<label class="center" for="radio-' + categoryId + '">' +
            (categoryLabel || 'Pas de catégorie') +
          '</label>' +
          '<div class="right">' +
            '<ons-icon style="color: grey; padding-left: 4px;margin-left: 5px;" icon="ion-ios-trash-outline, material:md-delete"></ons-icon>' +
          '</div>' +
        '</ons-list-item>'
      );

      myApp.services.categories.bindOnCheckboxChange(categoryItem);
      
      categoryItem.querySelector('.right').onclick = function() {
        ons.notification.confirm(
          {
            title: 'Supprimer toutes les tâches de '+categoryId+' ?',
            message: 'Toutes les tâches de '+categoryId+' vont être supprimées.',
            buttonLabels: ['Annuler', 'Supprimer']
          }
        ).then(function(buttonIndex) {
          if (buttonIndex === 1) {
            myApp.services.categories.remove(categoryItem);
            myApp.controllers.removeTaskFromCat(categoryLabel);
          }
        });
      };

      // Attach the new category to the corresponding list.
      document.querySelector('#custom-category-list').appendChild(categoryItem);
    },

    // On task creation/update, updates the category list adding new categories if needed.
    updateAdd: function(categoryLabel) {
      //var categoryId = myApp.services.categories.parseId(categoryLabel);
      var categoryId = categoryLabel;
      var categoryItem = document.querySelectorAll('#menuPage ons-list-item[category-id="' + categoryId + '"]');
      if (categoryItem.length <= 0) {
        // If the category doesn't exist already, create it.

        myApp.services.categories.create(categoryLabel);
      }
    },

    // On task deletion/update, updates the category list removing categories without tasks if needed.
    updateRemove: function(categoryLabel) {
      //var categoryId = myApp.services.categories.parseId(categoryLabel);
      var categoryId = categoryLabel;
      var categoryItem = document.querySelectorAll('#tabbarPage ons-list-item[category="' + categoryId + '"]');
      if (categoryItem.length <= 0) {
        // If there are no tasks under this category, remove it.
        myApp.services.categories.remove(document.querySelector('#custom-category-list ons-list-item[category-id="' + categoryId + '"]'));
        myApp.controllers.removeCategory(categoryId);
      }
    },

    // Deletes a category item and its listeners.
    remove: function(categoryItem) {
      if (categoryItem) {
        // Remove listeners and the item itself.
        categoryItem.removeEventListener('change', categoryItem.updateCategoryView);
        categoryItem.remove();
      }
    },

    bindOnCheckboxChange: function(categoryItem) {
      console.log("ui")
      var categoryId = categoryItem.getAttribute('category-id');
      var allItems = categoryId === null;

      categoryItem.updateCategoryView = function() {
        var query = '[category="' + (categoryId || '') + '"]';

        var taskItems = document.querySelectorAll('#tabbarPage ons-list-item');
        for (var i = 0; i < taskItems.length; i++) {
          taskItems[i].style.display = (allItems || taskItems[i].getAttribute('category') === categoryId) ? '' : 'none';
        }
      };
      categoryItem.querySelector('.left').addEventListener('change', categoryItem.updateCategoryView);
    },

    // Transforms a category name into a valid id.
    parseId: function(categoryLabel) {
      return categoryLabel; //categoryLabel ? categoryLabel.replace(/\s\s+/g, ' ').toLowerCase() : '';
    }
  },

  //////////////////////
  // Animation Service //
  /////////////////////
  animators: {

    // Swipe animation for task completion.
    swipe: function(listItem, callback) {
      var animation = (listItem.parentElement.id === 'pending-list') ? 'animation-swipe-right' : 'animation-swipe-left';
      listItem.classList.add('hide-children');
      listItem.classList.add(animation);

      setTimeout(function() {
        listItem.classList.remove(animation);
        listItem.classList.remove('hide-children');
        callback();
      }, 950);
    },

    // Remove animation for task deletion.
    remove: function(listItem, callback) {
      listItem.classList.add('animation-remove');
      listItem.classList.add('hide-children');

      setTimeout(function() {
        callback();
      }, 750);
    }
  },

  ////////////////////////
  // Initial Data Service //
  ////////////////////////
  fixtures: (JSON.parse(window.localStorage.getItem("datas")) || [])
};
