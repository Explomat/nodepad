var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LoginToken = new Schema({
	email: {
		type: String,
		index: true,
		required: true
	},
	series: {
		type: String,
		index: true,
		required: true
	},
	token: {
		type: String,
		index: true,
		required: true
	}
});

LoginToken.pre('validate', function(next){
	this.token = this.randomToken();
	this.series = this.randomToken();
	next();
});

LoginToken.methods.randomToken = function(password) {
	return Math.round((new Date().valueOf() * Math.random())) + '';
};

module.exports = mongoose.model('LoginToken', LoginToken);