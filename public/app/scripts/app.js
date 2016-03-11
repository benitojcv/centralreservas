'use strict';

/**
 * @ngdoc overview
 * @name opencancitapreviaApp
 * @description
 * # opencancitapreviaApp
 *
 * Main module of the application.
 */
angular
  .module('opencancitapreviaApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'mwl.calendar', 'ui.bootstrap', // bootstrap calendar
    'oitozero.ngSweetAlert', // sweetAlert module
    'angucomplete-alt' // autocomplete

  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
