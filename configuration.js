exports.Configuration = {
		// Configuracion del servicio
		portLaunch: process.env.PORT || '3000',
		mongoServer: process.env.MONGOSERVER || 'mongodb',
		redisServer: process.env.REDISSERVER || 'redisdb',
		numDoctors: process.env.NUMDOCTORS || 10000,
		firsthour: 8,
		lasthour: 18,
		meetingDuration: 10,  // in minutes

		// Configuracion de mongodb
		mongodb_connectionstring: function() {
			return this["mongoServer"] + ":27017/citaprevia";
		},

		printConfiguration: function() {
			console.log(this);
			console.log(this.mongodb_connectionstring());
		}
}
