/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/
 //window.localStorage.setItem("datas",JSON.stringify(new Array()))
myApp.controllers = {

  //////////////////////////
  // Tabbar Page Controller //
  //////////////////////////
  tabbarPage: function(page) {
    // Set button functionality to open/close the menu.

    page.querySelector('[component="button/menu"]').onclick = function() {
      document.querySelector('#mySplitter').left.toggle();
    };

    document.querySelector('#sort-asc').onclick = function () {
      let needToSort = page.querySelectorAll("ons-page [style='display: block;'] ons-list-item");
      let thisPage = page.querySelector("ons-page [style='display: block;']");
      let needToSortWithDate = [];
      let needToSortWithTitle = [];
      needToSort.forEach(function(e) {
        if (e.data.date) {
          needToSortWithDate.push(e);
        }
        else {
          needToSortWithTitle.push(e);
        }
      });

      if (needToSortWithDate)
        needToSortWithDate.sort(function(a,b) {
          let dateA = new Date(a.data.date);
          let dateB = new Date(b.data.date)
          return dateA - dateB;
        });

      if(needToSortWithTitle)
        needToSortWithTitle.sort(function(a, b) {
          var titleA = a.data.title.toLowerCase(), titleB = b.data.title.toLowerCase();
          if (titleA < titleB) return -1;
          if (titleA > titleB) return 1;
          return 0;
        });
      thisPage.innerHTML = "";


      needToSortWithDate.forEach(function(e) {
        thisPage.appendChild(e);
      });
      needToSortWithTitle.forEach(function(e) {
        thisPage.appendChild(e);
      });
    };

    document.querySelector('#sort-desc').onclick = function () {
      let needToSort = page.querySelectorAll("ons-page [style='display: block;'] ons-list-item");
      let thisPage = page.querySelector("ons-page [style='display: block;']");
      let needToSortWithDate = [];
      let needToSortWithTitle = [];
      needToSort.forEach(function(e) {
        if (e.data.date) {
          needToSortWithDate.push(e);
        }
        else {
          needToSortWithTitle.push(e);
        }
      });

      if (needToSortWithDate)
        needToSortWithDate.sort(function(a,b) {
          let dateA = new Date(a.data.date);
          let dateB = new Date(b.data.date)
          return dateB - dateA;
        });

      if(needToSortWithTitle)
        needToSortWithTitle.sort(function(a, b) {
          var titleA = a.data.title.toLowerCase(), titleB = b.data.title.toLowerCase();
          if (titleA < titleB) return 1;
          if (titleA > titleB) return -1;
          return 0;
        });
      thisPage.innerHTML = "";


      needToSortWithDate.forEach(function(e) {
        thisPage.appendChild(e);
      });
      needToSortWithTitle.forEach(function(e) {
        thisPage.appendChild(e);
      });
    };

    // Set button functionality to push 'new_task.html' page.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-task"]'), function(element) {
      element.onclick = function() {
        document.querySelector('#myNavigator').pushPage('html/new_task.html');
      };

      element.show && element.show(); // Fix ons-fab in Safari.
    });

    Array.prototype.forEach.call(page.querySelectorAll('[component="button/help"]'), function(element) {
      element.onclick = function() {
        document.querySelector('#myNavigator').pushPage('html/help.html');
      };

      element.show && element.show(); // Fix ons-fab in Safari.
    });


    // Change tabbar animation depending on platform.
    page.querySelector('#myTabbar').setAttribute('animation', ons.platform.isAndroid() ? 'slide' : 'none');
  },

  ////////////////////////
  // Menu Page Controller //
  ////////////////////////
  menuPage: function(page) {
    document.querySelector("#deleteAllButton").addEventListener('click', myApp.controllers.removeAll);
    document.querySelector("#deleteExpiredButton").addEventListener('click', myApp.controllers.removeExpired);
    // Set functionality for 'No Category' and 'All' default categories respectively.
    myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item[category-id=""]'));
    myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item:not([category-id])'));
    // Change splitter animation depending on platform.
    document.querySelector('#mySplitter').left.setAttribute('animation', ons.platform.isAndroid() ? 'overlay' : 'reveal');
  },

  ////////////////////////////
  // New Task Page Controller //
  ////////////////////////////
  newTaskPage: function(page) {

    // Set button functionality to save a new task.
    document.querySelector("#choose-sel-new-input").addEventListener('input', function () {
      if(this.value != '') {
        document.querySelector("#choose-sel-new select").disabled = true;
      } 
      else {
        document.querySelector("#choose-sel-new select").disabled = false;
      }
    });
    myApp.controllers.displayCat(page, "#choose-sel-new");

    Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-task"]'), function(element) {
      element.onclick = function() {
        var newTitle = page.querySelector('#title-input').value;



        if (newTitle) {
          let newCat;
            if (page.querySelector('#choose-sel-new-input').value != '') {
                let e = page.querySelector('#choose-sel-new-input').value;
                //myApp.services.categories.updateRemove(element.data.category);
                myApp.services.categories.updateAdd(e);
                myApp.controllers.displayCat(page, "#choose-sel-new");
                newCat = e;
            }
            else if (page.querySelector('#choose-sel-new').options[page.querySelector('#choose-sel-new').selectedIndex].value != "noCat"){
              newCat = page.querySelector('#choose-sel-new').options[page.querySelector('#choose-sel-new').selectedIndex].value;
            }
          // If input title is not empty, create a new task.
          let data;
          if (page.querySelector('#date-input').value != undefined) {
            if (newCat == undefined) {
              data = {
                title: newTitle,
                category: '',
                description: page.querySelector('#description-input').value,
                date: page.querySelector('#date-input').value,
                highlight: page.querySelector('#highlight-input').checked,
                urgent: page.querySelector('#urgent-input').checked,
                done: 0
              };
            }
            else {
              data = {
                title: newTitle,
                category: newCat,
                description: page.querySelector('#description-input').value,
                date: page.querySelector('#date-input').value,
                highlight: page.querySelector('#highlight-input').checked,
                urgent: page.querySelector('#urgent-input').checked,
                done: 0
              };
            }
          }
          else {
            if (newCat == undefined) {
              data = {
                title: newTitle,
                category: '',
                description: page.querySelector('#description-input').value,
                date: '',
                highlight: page.querySelector('#highlight-input').checked,
                urgent: page.querySelector('#urgent-input').checked,
                done: 0
              };
            }
            else {
              data = {
                title: newTitle,
                category: newCat,
                description: page.querySelector('#description-input').value,
                date: '',
                highlight: page.querySelector('#highlight-input').checked,
                urgent: page.querySelector('#urgent-input').checked,
                done: 0
              };
            }
          }
          	
            datasTmp = myApp.services.fixtures;
            datasTmp.push(data);
            window.localStorage.setItem("datas",JSON.stringify(datasTmp));
            myApp.services.tasks.create(data);

          // Set selected category to 'All', refresh and pop page.
          //document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
          //document.querySelector('#default-category-list ons-list-item').updateCategoryView();
          document.querySelector('#myNavigator').popPage();

        } else {
          // Show alert if the input title is empty.
          ons.notification.alert('Donnez un titre à la tâche');
        }
      };
    });
  },

  ////////////////////////////
  // Remove task Controller //
  ////////////////////////////
  remove: function(data) {
    let find = false, i = 0;
    datasTmp = JSON.parse(window.localStorage.getItem("datas"));
    while(i < datasTmp.length & !find) {
    	if (data.title == datasTmp[i].title) {
    		datasTmp.splice( i, 1 );
    	}
    	i++;
    }
    window.localStorage.setItem("datas",JSON.stringify(datasTmp));
  },

  ////////////////////////////
  // Remove All task Controller //
  ////////////////////////////
  removeAll: function() {
    ons.notification.confirm(
          {
            title: 'Supprimer toutes les tâches ?',
            message: 'Toutes les tâches vont être supprimées.',
            buttonLabels: ['Annuler', 'Supprimer']
          }
        ).then(function(buttonIndex) {
          if (buttonIndex === 1) {
    myApp.services.fixtures.forEach((e) => {
      document.querySelector("#pending-list").innerHTML = "";
      document.querySelector("#waiting-list").innerHTML = "";
      document.querySelector("#completed-list").innerHTML = "";
      document.querySelector("#expired-list").innerHTML = "";
      document.querySelector("#custom-category-list").innerHTML = "";
      //window.localStorage.removeItem("datas");
      window.localStorage.clear();
    })}});
  },

  ////////////////////////////
  // Remove All task from categorie Controller //
  ////////////////////////////
  removeTaskFromCat: function(categoryId) {
    myApp.controllers.removeCategory(categoryId);
    myApp.services.fixtures.forEach((e) => {
      if (categoryId === e.category) {
        myApp.controllers.remove(e);
      }
    });
    document.querySelector("#pending-list").innerHTML = "";
    document.querySelector("#waiting-list").innerHTML = "";
    document.querySelector("#completed-list").innerHTML = "";
    document.querySelector("#expired-list").innerHTML = "";
    document.querySelector("#custom-category-list").innerHTML = "";
    let datasTmp = JSON.parse(window.localStorage.getItem("datas"));
    datasTmp.forEach((e) => {
      myApp.services.tasks.create(e);
    });
  },

  ////////////////////////////
  // Remove All expired task Controller //
  ////////////////////////////
  removeExpired: function() {
    ons.notification.confirm(
          {
            title: 'Supprimer les tâches expirées ?',
            message: 'Toutes les tâches expirées vont être supprimées.',
            buttonLabels: ['Annuler', 'Supprimer']
          }
        ).then(function(buttonIndex) {
          if (buttonIndex === 1) {
            myApp.services.fixtures.forEach((e) => {
              if(e.done == 3) {
                myApp.controllers.remove(e);
              }
              document.querySelector("#expired-list").innerHTML = "";

          })}});
  },

  ////////////////////////////
  // Change state task Controller //
  ////////////////////////////
  changeStateTask: function(data) {
    let find = false, i = 0;
    datasTmp = JSON.parse(window.localStorage.getItem("datas"));
    while(i < datasTmp.length & !find) {
    	if (data.title == datasTmp[i].title) {
    			datasTmp[i] = data;
    	}
    	i++;
    }
    window.localStorage.setItem("datas",JSON.stringify(datasTmp));
  },


  displayCat: function(page, selector) {
    let catDatas = JSON.parse(window.localStorage.getItem("categories")) || [];
    while (document.querySelector(selector+" select").childNodes.length > 2) {
        document.querySelector(selector+" select").removeChild(document.querySelector(selector+" select").lastChild);
    }
    catDatas.forEach((e) => {
      var option = document.createElement("option");
      option.text = e;
      option.value = e;
      document.querySelector(selector+" select").appendChild(option);
    });
  },
  ////////////////////////////////
  // Details Task Page Controller //
  ///////////////////////////////
  detailsTaskPage: function(page) {
    // Get the element passed as argument to pushPage.
    var element = page.data.element;
    document.querySelector("#choose-sel-input").addEventListener('input', function () {
      if(this.value != '') {
        document.querySelector("#choose-sel select").disabled = true;
      } 
      else {
        document.querySelector("#choose-sel select").disabled = false;
      }
    });
    myApp.controllers.displayCat(page, "#choose-sel");

    // Fill the view with the stored data.
    page.querySelector('#title-input').value = element.data.title;
    //page.querySelector('#category-input').value = element.data.category;
    if (page.querySelector('#choose-sel option[value="'+element.data.category+'"]') != null) {
      page.querySelector('#choose-sel').selectedIndex = page.querySelector('#choose-sel option[value="'+element.data.category+'"]').index;
    }
    page.querySelector('#date-input').value = element.data.date;
    page.querySelector('#description-input').value = element.data.description;
    page.querySelector('#highlight-input').checked = element.data.highlight;
    page.querySelector('#urgent-input').checked = element.data.urgent;

    // Set button functionality to save an existing task.
    page.querySelector('[component="button/save-task"]').onclick = function() {
      var newTitle = page.querySelector('#title-input').value;

      if (newTitle) {
        // If input title is not empty, ask for confirmation before saving.
        ons.notification.confirm(
          {
            title: 'Sauvegarder les changements ?',
            message: 'Nous allons écraser les données.',
            buttonLabels: ['Annuler', 'Sauvegarder']
          }
        ).then(function(buttonIndex) {
          if (buttonIndex === 1) {
            let newCat;
            if (page.querySelector('#choose-sel-input').value != '') {
                let e = page.querySelector('#choose-sel-input').value;
                myApp.services.categories.updateRemove(element.data.category);
                myApp.services.categories.updateAdd(e);
                myApp.controllers.displayCat(page, "#choose-sel");
                newCat = e;
            }
            else {
              newCat = page.querySelector('#choose-sel').options[page.querySelector('#choose-sel').selectedIndex].value;
            }
            // If 'Save' button was pressed, overwrite the task.

            let data = {
                title: newTitle,
                category: newCat,
                description: page.querySelector('#description-input').value,
                date: page.querySelector('#date-input').value,
                ugent: element.data.urgent,
                highlight: page.querySelector('#highlight-input').checked,
                done: 0
              };
            datasTmp = JSON.parse(window.localStorage.getItem("datas"));
            datasTmp.forEach((e, index, array) => {
            	if (e.title == page.querySelector('#title-input').value) {
            		array[index] = data;
            	}
            });
            //datasTmp.push(data);
            window.localStorage.setItem("datas",JSON.stringify(datasTmp));
            //window.localStorage.clear();
            myApp.services.tasks.update(element,data);

            // Set selected category to 'All', refresh and pop page.
            //document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
            //document.querySelector('#default-category-list ons-list-item').updateCategoryView();
            document.querySelector('#myNavigator').popPage();
          }
        });

      } else {
        // Show alert if the input title is empty.
        ons.notification.alert('Donnez un titre à la tâche');
      }
    };
  },

  ////////////////////////////
  // New category Controller //
  ////////////////////////////
  addCategory: function(categoryId) {
    let catDatas = (JSON.parse(window.localStorage.getItem("categories")) || new Array());
    if (catDatas.indexOf(categoryId) == -1 ) {
      catDatas.push(categoryId);
    }
    window.localStorage.setItem("categories", JSON.stringify(catDatas));
  },

  ////////////////////////////
  // Remove category Controller //
  ////////////////////////////
  removeCategory: function(categoryId) {
    let catDatas = (JSON.parse(window.localStorage.getItem("categories")) || new Array());
    let index = catDatas.indexOf(categoryId);
    if (index > -1 ) {
      catDatas.splice(index,1);
    }
    window.localStorage.setItem("categories", JSON.stringify(catDatas));
  }
    
};
