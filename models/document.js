var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Document = new Schema({
	title: {
		type: String,
		required: true
	},
	data: {
		type: String,
		required: true
	},
	tags: {
		type: String,
		index: true
	},
	userId: {
		type: Schema.ObjectId,
		required: true
	}
});

module.exports = mongoose.model('Document', Document);