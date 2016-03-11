'use strict';

/**
 * @ngdoc function
 * @name opencancitapreviaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the opencancitapreviaApp
 */
angular.module('opencancitapreviaApp')
  .controller('MainCtrl', function ($scope, moment,citapreviaService,SweetAlert
  ) {

  var vm = this;

  var _HOST = 'k8s-pre-opencanarias.opencanarias.com:80';
  var _SERVICE = '/citaprevia';

  vm.events = [];
  vm.doctor = undefined;

  vm.doctors = undefined;
  refreshDoctors();

  function refreshDoctors() {
    citapreviaService.getResource(_HOST,_SERVICE+'/doctors',
    function (doctors) {
      console.log("#### available doctors ",doctors);
      vm.doctors = doctors
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
     patient: meeting.user,
     doctor: meeting.doctor,
     _id:meeting._id
   });
  }

  // Búsqueda de citas por médico
  vm.search = function(doctor){
    if (doctor == undefined) {
      SweetAlert.swal("Doctor not found","","error");
      return;
    }
    vm.events = [];
    vm.doctor = doctor.description;
    console.log("### search dates for doctor " + JSON.stringify(doctor));
    citapreviaService.getResource(_HOST,_SERVICE+'/doctors'+'/'+doctor.description.id+'/meetings',
    function (meetings) {
      for (var i in meetings)
        print(meetings[i]);
    });
  };

  vm.newDate = function(patient) {
    if (patient == undefined)
      SweetAlert.swal("Patiend id cannot be empty","","error");

    console.log("### new date for patient " + patient);
    citapreviaService.postResource(_HOST,_SERVICE+'/users'+'/'+patient+'/meetings',
    function (meeting) {
      SweetAlert.swal("The date for patient "+patient+" has been created correctly",
        "Dr: "+meeting.doctor+" - "+moment(meeting.meeting).format('DD/MM/YYYY HH:m:SS'),
        "success");
        refreshDoctors();
    });
  }

  vm.localsearchdoctors = function(input) {
    var result = [];
    var index = 0;
    var founded = 0;
    while ((index < vm.doctors.length) && (founded < 5)) {
        if ((vm.doctors[index]['id'].indexOf(input) >= 0) ||
        (vm.doctors[index]['name'].indexOf(input) >= 0)){
          result.push(vm.doctors[index]);
          founded++;
        }
        index++;
    }
    return result;
  }

});
