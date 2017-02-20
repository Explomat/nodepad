var User = require('../models/user');

function loadUser(req, res, next) {
	if (req.session.currentUser){
		User.findById(req.session.currentUser._id, (err, user) => {
			if (user) {
				next();
			} else {
				res.redirect('/sessions/new');
			}
		});
	} else {
		res.redirect('/sessions/new');
	}
}

module.exports = {
	loadUser: loadUser
}