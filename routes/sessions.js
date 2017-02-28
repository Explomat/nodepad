var express = require('express'),
	router = express.Router(),
	User = require('../models/user'),
	LoginToken = require('../models/loginToken'),
	loadUser = require('./auth').loadUser;

// Сессии
router.get('/new', (req, res) => {
	res.locals.flash = req.flash('flash');
	res.render('sessions/new', {
		user: new User()
	});
});

router.post('/', (req, res) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (user && user.authenticate(req.body.password)){
			req.session.user_id = user.id;
			req.currentUser = user;
			
			// запомнить меня
			if (req.body.remember_me) {
				var loginToken = new LoginToken({ email: user.email });
				loginToken.save(function(err) {
					res.cookie('logintoken', loginToken, {
						expires: new Date(Date.now() + 2 * 60000), // 2 недели
						path: '/'
					});
					res.redirect('/documents');
				});
			}
			else {
				res.redirect('/documents');
			}
		}
		else {
			req.flash('flash', 'Неверный логин или пароль!');
			res.redirect('sessions/new');
		}
	});
});

router.delete('/', loadUser, (req, res) => {
	// Удалить сессию
	if (req.session) {
		LoginToken.remove({ email: req.currentUser.email }, function() {});
    	res.clearCookie('logintoken');
		req.session.destroy(function() {});
	}
	res.redirect('/sessions/new');
});

module.exports = router;