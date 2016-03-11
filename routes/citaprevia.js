var express = require('express');
var router = express.Router();

var _ = require('lodash');

var service = require('../services/citapreviaservice.js').CitapreviaService;
var configuration = require('../configuration.js').Configuration;

var helper = require('../services/citapreviaHelper.js').CitapreviaHelper;


router.get('/meetings', function(req, res, next) {
  var db = req.db;
	var collection = db.get('meetings');
	collection.find({}, {}, function(e, docs) {
		res.send(docs);
	});
});

router.get('/users/:user/meetings', function(req, res, next) {
  var db = req.db;
	var collection = db.get('meetings');
	collection.find({'user': req.params.user, 'status': 'new', 'meeting': { '$gte': new Date() }}, {}, function(e, docs) {
    if (docs.length > 0)
		  res.send(docs[0]);
    else {
      res.status(500);
      res.send({
        message: 'user has not meeting'
      });
    }
	});
});

router.get('/doctors', function(req, res, next) {
  var db = req.db;
  db.get('meetings').find({}, {}, function(err, docs){
    if (err) {
      res.status(500);
      res.send("Error to get doctors");
    }
    else {
      var doctors = _.keys(_.groupBy(docs, 'doctor'));

      res.send(_.map(doctors, function(d) { return {
          id: d,
          name: 'doctor_'+d
        }
      }));
    }
  });
});

router.get('/doctors/:doctor/meetings', function(req, res, next) {
  var db = req.db;
  db.get('meetings').find({'doctor': _.toNumber(req.params.doctor), 'meeting': { '$gte': new Date() }}, {}, function(err, docs) {
    if (docs.length > 0)
		  res.send(docs);
    else {
      res.status(500);
      res.send(docs);
    }
	});
});


router.get('/meetings/:cita', function(req, res, next) {
  var db = req.db;
	var collection = db.get('meetings');
	collection.find({_id: req.params.cita}, {}, function(e, docs) {
    if (docs.length > 0)
		  res.send(docs[0]);
    else {
      res.status(500);
      res.send({
        message: 'meeting not found'
      });
    }
	});
});

router.get('/status', function(req, res, next) {
  var status = {};

  var db = req.db;
	var collection = db.get('meetings');
  collection.find({'status': 'new'}, {}, function(e, docs) {
    status.numMeetings = docs.length;

    var byDoctor = _.countBy(docs, 'doctor');
    status.numDoctors = _.values(byDoctor).length;
    status.maxMeetingsByDoctor = _.max(_.values(byDoctor));
    status.avgMeetingsByDoctor = _.mean(_.values(byDoctor));
    status.maxMeeting = (docs.length > 0) ? _.maxBy(docs, function(m) { return m.meeting.getTime(); }).meeting : 0;

    var inconsistencies = helper.detectInconsistencies(docs);

    for (var i in inconsistencies) {
      // console.log("inconsistencies[" + i + "][meeting1]: " + JSON.stringify(inconsistencies[i]['meeting1']));
      collection.remove({_id: inconsistencies[i]['meeting1']['_id']}, { justOne: true });
    }


    var inconsistencies2;
    collection.find({'status': 'new'}, {}, function(e, docs) {
      inconsistencies2 = helper.detectInconsistencies(docs);

      // status.numInconsistenciesBefore = inconsistencies.length;
      // status.numInconsistenciesAfter = inconsistencies2.length;
      console.log("numB: " + inconsistencies.length);
      console.log("numA: " + inconsistencies2.length);

      res.send(status);
    });
  });
});

router.delete('/meetings', function(req, res, next) {
  var db = req.db;
	var collection = db.get('meetings');
  collection.remove({}, {}, function(err, result){
    res.send("Meetings deleted: " + result);
  });
});

router.post('/users/:user/meetings', function(req, res, next) {
  service.createMeeting(req.params.user, req.query.daysafter || 0, req.db, req.redisClient)
    .then(function(meeting) {
      res.status(201);
      res.send(meeting);
    }, function(err) {
      console.log("ERROR");
      console.log(err);
      res.status(500);
      res.send(err);
    });
});

router.delete('/meetings/:cita', function(req, res, next) {
  service.deleteMeeting(req.params.cita, req.db)
    .then(function() {
      res.status(200);
      res.send("");
    }, function(err) {
      res.status(500);
      res.send(err);
    });
});

module.exports = router;
