var User = require('../models/user'),
	LoginToken = require('../models/loginToken');

function authenticateFromLoginToken(req, res, next) {
	var cookie = req.cookies.logintoken;
	//console.log('cookie: ', cookie);
	
	LoginToken.findOne(
	{
		email: cookie.email,
        series: cookie.series,
        token: cookie.token
    }, function(err, t) {
		if (!t) {
			res.redirect('/sessions/new');
			return;
		}
		
		User.findOne({ email: t.email }, function(err, user){
			if (user){
				req.session.user_id  = user.id;
				req.currentUser = user;
				
				t.token = t.randomToken();
				t.save(function(){
					res.cookie('logintoken', t, {
						expires: new Date(Date.now() + 2 * 6000),
						path: '/' });
					next();
				});
			} else {
				res.redirect('sessions/new');
			}
		});
    });
}

function loadUser(req, res, next) {
	if (req.session.user_id){
		User.findById(req.session.user_id, (err, user) => {
			if (user) {
				req.currentUser = user;
				next();
			} else {
				res.redirect('/sessions/new');
			}
		});
	} else if (req.cookies.logintoken){
		authenticateFromLoginToken(req, res, next);
	} else {
		res.redirect('/sessions/new');
	}
}

module.exports = {
	loadUser: loadUser
}