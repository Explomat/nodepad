var express = require('express'),
	router = express.Router(),
	User = require('../models/user'),
	loadUser = require('./auth').loadUser;

// Сессии
router.get('/new', (req, res) => {
	res.render('sessions/new', {
		user: new User()
	});
});

router.post('/', (req, res) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (user && user.authenticate(req.body.password)){
			req.session.currentUser = user;
			res.redirect('/documents');
		}
		else {
			req.flash('failure', 'Incorrect credentials');
			res.render('sessions/new', {
				user: req.body,
				flash: req.flash('failure')
			});
		}
	});
});

router.delete('/', loadUser, (req, res) => {
	// Удалить сессию
	if (req.session) {
		req.session.destroy(function() {});
	}
	res.redirect('/sessions/new');
});

module.exports = router;