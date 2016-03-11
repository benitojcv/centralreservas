var configuration = require('../configuration.js').Configuration;
var _ = require('lodash');

exports.CitapreviaHelper = {
  detectInconsistencies: function(meetings) {
    var sortedMeetings = _.orderBy(meetings, ['doctor', 'meeting']);
    var groupedMeetings = _.groupBy(sortedMeetings, 'doctor');
    var inconsistencies = [];
    for (var doctor in groupedMeetings) {
      for (var i = 0; i < groupedMeetings[doctor].length - 1; i++) {
        if (groupedMeetings[doctor][i+1]['meeting'].getTime() <
            groupedMeetings[doctor][i]['meeting'].getTime() + (groupedMeetings[doctor][i]['duration'] * 60 * 1000)) {
              inconsistencies.push({meeting1: groupedMeetings[doctor][i], meeting2: groupedMeetings[doctor][i+1]});
            }
      }
    }
    return inconsistencies;
  },
  newDoctor: function () {
    return _.random(configuration.numDoctors);
  },
  getDaysAfter: function(date, daysafter) {
    var newDate = date;

    if (daysafter > 0) {
      newDate.setHours(configuration.firsthour);
      newDate.setMinutes(0);
    }

    newDate.setTime(newDate.getTime() + (daysafter * 86400000)); // Days to miliseconda = 24 * 60 * 60 * 1000
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    return newDate;
  },
  nextMeeting: function(date) {
    var d = date;
    d.setTime(d.getTime() + (configuration.meetingDuration * 60 * 1000)); // now + meetingDuration

    if (d.getHours() === 0) {
      d.setHours(configuration.firsthour);
      d.setMinutes(0);
    }
    else if (d.getHours() >= configuration.lasthour) {
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000); //FIXME: usar getDaysAfter
        d.setHours(configuration.firsthour);
        d.setMinutes(0);
    }

    d.setSeconds(0);
    d.setMilliseconds(0);

    return d;
  }
}
