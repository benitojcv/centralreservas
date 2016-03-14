'use strict';

/**
 * @ngdoc function
 * @name opencancentralreservasApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the opencancentralreservasApp
 */
angular.module('opencancentralreservasApp')
  .controller('MainCtrl', function ($scope, moment,centralreservasService,SweetAlert
  ) {

  var vm = this;

  var _HOST = 'k8s-pre-opencanarias.opencanarias.com:80';
  var _SERVICE = '/centralreservas';

  vm.events = [];
  vm.diary = undefined;

  vm.diaries = undefined;
  refreshDiaries();

  vm.click = function (button) {
    console.clear();
    $(button).click();
  };


  function refreshDiaries() {
    centralreservasService.getResource(_HOST,_SERVICE+'/diaries',
    function (diaries) {
      console.log("#### available diaries ",diaries);
      vm.diaries = diaries
    });
  }

  //These variables MUST be set as a minimum for the calendar to work
  vm.calendarView = 'month';
  vm.viewDate = new Date();
  vm.isCellOpen = true;

  vm.toggle = function($event, field, event) {
    $event.preventDefault();
    $event.stopPropagation();
    event[field] = !event[field];
  };

  // Añade al calendario la cita pasada por parámetro
  function print(meeting) {
    console.log("#### printing meeting ",meeting);

    vm.events.push({
     title: '<i class="glyphicon glyphicon-comment"></i> <span>'+meeting.user+'</span>',
     type: 'info',
     startsAt: moment(meeting.meeting).toDate(),
     endsAt: moment(meeting.meeting).add(meeting.duration, 'minutes').toDate(),
     user: meeting.user,
     diary: meeting.diary,
     _id:meeting._id
   });
  }

  // Búsqueda de citas por médico
  vm.search = function(diary){
    if (diary == undefined) {
      SweetAlert.swal("Diary not found","","error");
      return;
    }
    vm.events = [];
    vm.diary = diary.description;
    console.log("### search dates for diary " + JSON.stringify(diary));
    centralreservasService.getResource(_HOST,_SERVICE+'/diaries'+'/'+diary.description.id+'/meetings',
    function (meetings) {
      for (var i in meetings)
        print(meetings[i]);
    });
  };

  vm.newDate = function(user) {
    if (user == undefined)
      SweetAlert.swal("User id cannot be empty","","error");

    console.log("### new date for user " + user);
    centralreservasService.postResource(_HOST,_SERVICE+'/users'+'/'+user+'/meetings',
    function (meeting) {
      SweetAlert.swal("The date for user "+user+" has been created correctly",
        "Dr: "+meeting.diary+" - "+moment(meeting.meeting).format('DD/MM/YYYY HH:m:SS'),
        "success");
        refreshDiaries();
    });
  }

  vm.localsearchdiaries = function(input) {
    var result = [];
    var index = 0;
    var founded = 0;
    while ((index < vm.diaries.length) && (founded < 5)) {
        if ((vm.diaries[index]['id'].indexOf(input) >= 0) ||
        (vm.diaries[index]['name'].indexOf(input) >= 0)){
          result.push(vm.diaries[index]);
          founded++;
        }
        index++;
    }
    return result;
  }

});
