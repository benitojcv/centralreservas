var configuration = require('../configuration.js').Configuration;
var helper = require('./citapreviaHelper.js').CitapreviaHelper;
var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');
var hal = require('hal');


exports.CitapreviaService = {
  deleteMeeting: function(meeting, db) {
    return new Promise(function(fulfill, reject) {
      db.get('meetings').update(
        {"_id": meeting},
        {
          $set: {
            "status": "canceled"
          },
          $currentDate: { "lastModified": true }
        }, function(err, results) {
          if (err)
            reject(err);
          else
            fulfill();
      });
    });
  },
  createMeeting: function(user, daysafter, db, redisClient) {
    return new Promise(function(fulfill, reject) {

      // Calculate meeting fromdate (minimum date)
      var fromdate = helper.getDaysAfter(new Date(), daysafter);
      // console.log(fromdate);

      //Locate Doctor's user
      redisClient.get(user, function(err, doctor) {
        if (err) {
          console.log(err);
          reject(err);
        }
        else {
          if (doctor == null) {
            doctor = helper.newDoctor();
            redisClient.set(user, doctor);
          }

          //get Diary's Doctor
          db.get('meetings').find(
            {
              'doctor': _.toNumber(doctor),
              'status': 'new',
              'meeting': { '$gte': new Date() }
            }, {}, function(err, docs) {
            if (err) {
              console.log(err);
              reject(err);
              return;
            }

            // check if exist meeting
            var meeting = _.find(docs, function(m) { return m.user === user});
            if (meeting) {
              meeting.status = 'exists';
              reject(meeting);
              return;
            }

            // user has not meeting
            var uniqueid = new ObjectID();
            meeting = new hal.Resource({
                _id: uniqueid,
                'user': user,
                'doctor': _.toNumber(doctor),
                'duration': configuration.meetingDuration,
                'status': 'new'
              }, "/citaprevia" + "/meetings/" + uniqueid);
            meeting.link("delete", "/citaprevia" + "/meetings/" + uniqueid);

            if (docs.length > 0) {
              // Filter and Order meetings
              var docs = _.filter(docs, function(m) { return m.meeting.getTime() >= fromdate.getTime(); });
              var sortedMeetings = _.sortBy(docs, ['meeting']);

              // console.log(sortedMeetings);

              // Include meeting for detect initial holes
              sortedMeetings.unshift({
                meeting: fromdate,
                duration: configuration.meetingDuration
              });

              // Calculate holes
              for (var i = 0; i < sortedMeetings.length; i++) {
                if (i === sortedMeetings.length - 1) {
                  sortedMeetings[i].hole = configuration.meetingDuration; // Valor maximo de hueco
                }
                else {
                  sortedMeetings[i].hole = Math.abs(
                    sortedMeetings[i + 1].meeting -
                    (sortedMeetings[i].meeting
                    + (sortedMeetings[i].duration * 60000)) // 60 * 1000 = minutes to miliseconds
                  ) / 60000; // hole in minutes

                  // console.log(sortedMeetings[i].hole);
                }
              }

              // Locate hole for meeting
              var holeFinded = _.find(sortedMeetings, function(m) {
                return (m.hole >= configuration.meetingDuration);
              });
              // console.log("*** Hueco encontrado: " + JSON.stringify(holeFinded));

              if (holeFinded == undefined) {
                meeting['meeting'] = helper.nextMeeting(fromdate);
              }
              else
                meeting['meeting'] = helper.nextMeeting(holeFinded.meeting);
            }
            else {
              // Push first meeting
              meeting['meeting'] = helper.nextMeeting(fromdate);
            }

            // console.log("*** New Meeting");
            // console.log(meeting);

            // Save meeting
            db.get('meetings').insert(meeting,
              function(err, doc) {
                if (err) {
                  console.log(err);
                  reject(err);
                }

                fulfill(doc); // Return after save
            });

          });
        }
      });
    });
  }
}
