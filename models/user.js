var mongoose = require('mongoose'),
	crypto = require('crypto'),
    Schema = mongoose.Schema;

var User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
    	type: String,
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

User.methods.encryptPassword = password => {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

User.virtual('password')
    .set(password => {
        this._plainPassword = password;
        this.salt = Math.round((new Date().valueOf() * Math.random())) + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(() => {
        return this._plainPassword;
    });

User.methods.checkPassword = password => {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', User);