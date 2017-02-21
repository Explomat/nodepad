var mongoose = require('mongoose'),
	crypto = require('crypto'),
    Schema = mongoose.Schema;

var User = new Schema({
    email: {
    	type: String,
    	index: true,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

User.methods.encryptPassword = function(password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

User.methods.authenticate = function(password){
	return this.encryptPassword(password) === this.hashedPassword;
};

User.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.round((new Date().valueOf() * Math.random())) + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(() => {
        return this._plainPassword;
    });

module.exports = mongoose.model('User', User);