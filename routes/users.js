var express = require('express'),
	router = express.Router(),
	User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('users');
});

router.post('/', (req, res) => {
	var user = new User(req.body);
	user.save(err => {
		if (err){
			res.send(err);
		}
		else {
			req.session.currentUser = user;
			res.redirect('/documents');
		}
	}, () => {
		res.render('users/new', {
			user
		});
	});
});

router.get('/new', function(req, res, next) {
	res.render('users/new', {
		user: new User()
	});
});

module.exports = router;
