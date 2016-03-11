'use strict';

describe('Service: citapreviaService', function () {

  // load the service's module
  beforeEach(module('opencancitapreviaApp'));

  // instantiate service
  var citapreviaService;
  beforeEach(inject(function (_citapreviaService_) {
    citapreviaService = _citapreviaService_;
  }));

  it('should do something', function () {
    expect(!!citapreviaService).toBe(true);
  });

});
