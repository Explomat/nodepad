var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	Document = require('../models/document'),
	loadUser = require('./auth').loadUser;

// :format может быть json или html
router.get('/', loadUser, (req, res, next) => {
	//console.log(res);
	var userId = req.currentUser._id;
	Document.find({userId: userId}, (err, documents) => {
		//console.log(documents);
		res.render('documents/index', {
			documents,
			userId
		});
	});
});

router.get('/new', (req, res) => {
	var userId = req.currentUser._id;
	res.render('documents/new', {
		doc: new Document(),
		userId
	});
});

router.post('/new', (req, res) => {
	var doc = new Document(req.body);
	doc.save(err => {
		if (err){
			res.send(err);
		}
		else {
			res.redirect('/documents');
		}
	});
});

router.get('/edit/:id', (req, res) => {
	var userId = req.currentUser._id;
	Document.findOne({ _id: req.params.id, userId: userId }, (err, doc) => {
		if (err){
			res.send('Документ не найден');
		}
		else {
			res.render('documents/edit', {
				doc
			});
		}
	});
});

router.put('/', (req, res) => {
	var userId = req.currentUser._id;
	Document.findOne({ _id: req.body.id, userId: userId }, (err, d) => {
		if (err){
			res.send(err);
		}
		
		else {
			d.title = req.body.title;
			d.data = req.body.data;
			
			d.save(() => {
				res.redirect('/documents');
			});
		}
	});
});

router.delete('/', (req, res) => {
	var userId = req.currentUser._id;
	Document.findOne({ _id: req.body.id, userId: userId }, (err, d) => {
		if (err){
			res.send(err);
		}
		
		else {
			d.title = req.body.title;
			d.data = req.body.data;
			
			d.remove(() => {
				res.redirect('/documents');
			});
		}
	});
});

router.get('/:id', (req, res, next) => {
	var userId = req.currentUser._id;
	Document.findById({ _id: req.params.id, userId: userId }, (err, doc) => {
		if (err){
			return next('Документ не найден');
		}
		else {
			res.render('documents/view', {
				doc
			});
		}
	});
});

module.exports = router;