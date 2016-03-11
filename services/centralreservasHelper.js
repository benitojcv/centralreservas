var configuration = require('../configuration.js').Configuration;
var _ = require('lodash');

exports.centralreservasHelper = {
  detectInconsistencies: function(meetings) {
    var sortedMeetings = _.orderBy(meetings, ['diary', 'meeting']);
    var groupedMeetings = _.groupBy(sortedMeetings, 'diary');
    var inconsistencies = [];
    for (var diary in groupedMeetings) {
      for (var i = 0; i < groupedMeetings[diary].length - 1; i++) {
        if (groupedMeetings[diary][i+1]['meeting'].getTime() <
            groupedMeetings[diary][i]['meeting'].getTime() + (groupedMeetings[diary][i]['duration'] * 60 * 1000)) {
              inconsistencies.push({meeting1: groupedMeetings[diary][i], meeting2: groupedMeetings[diary][i+1]});
            }
      }
    }
    return inconsistencies;
  },
  newDiary: function () {
    return _.random(configuration.numDiaries);
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
