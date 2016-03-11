'use strict';

/**
 * @ngdoc service
 * @name opencancentralreservasApp.centralreservasService
 * @description
 * # centralreservasService
 * Service in the opencancentralreservasApp.
 */
angular.module('opencancentralreservasApp')
  .service('centralreservasService', function ($http,SweetAlert) {

    function absolutize(_GATEWAY, path) {
      // If absolute URI path
      if (path.indexOf('http://') === 0 ||
          path.indexOf('https://') === 0)
        return path;

      if (_GATEWAY.indexOf('http://') === 0 ||
          _GATEWAY.indexOf('https://') === 0) return _GATEWAY;
      return   'http://'+_GATEWAY+path;
    }

    /*
    Devuelve el Resource que está ubicado en la uri
    */
    this.getResource = function(_GATEWAY, path, callback) {
      var uri = absolutize(_GATEWAY,path);
      console.info("### getResource => uri : " + uri);
      $http.get(uri).success(function(data) {
        callback(data);
      }).error(function(err) {
        console.error("### getResource: " + err);
        SweetAlert.swal("Resource not found",uri,"error");
        return err;
      });
    };

    this.postResource = function(_GATEWAY, path, callback) {
      var uri = absolutize(_GATEWAY,path);
      console.info("### getResource => uri : " + uri);
      $http.post(uri).success(function(data) {
        callback(data);
      }).error(function(err) {
        console.error("### getResource: " + err);
        SweetAlert.swal("Unable to create",uri,"error");
        return err;
      });
    };


});
