var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Document = require('../models/document');

// :format может быть json или html
router.get('/', (req, res) => {
	console.log(req.session);
	Document.find({}, function(err, documents) {
		//console.log(documents);
		res.render('documents/index', {
			documents
		});
	});
});

router.get('/new', (req, res) => {
	res.render('documents/new', {
		doc: new Document()
	});
});

router.post('/new', (req, res) => {
	var doc = new Document(req.body);
	doc.save(() => {
		res.redirect('/documents');
	});
});

router.get('/edit/:id', (req, res) => {
	Document.findById(req.params.id, (err, doc) => {
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
	Document.findById(req.body.id, (err, d) => {
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
	Document.findById(req.body.id, (err, d) => {
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

router.get('/:id', (req, res) => {
	Document.findById(req.params.id, (err, doc) => {
		if (err){
			res.send('Документ не найден');
		}
		else {
			res.render('documents/view', {
				doc
			});
		}
	});
});

module.exports = router;