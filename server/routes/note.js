const express = require("express");

const routes = express.Router();

const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

routes.route("/note").get(function (req, res) {
	let db_connect = dbo.getDb("notes");
	db_connect
		.collection("notes")
		.find({})
		.toArray(function (err, result) {
			if (err) throw err;
			res.json(result);
		});
});

routes.route("/note").post(function (req, res) {
	let db_connect = dbo.getDb("notes");
	let startdate = new Date(req.body.start_date);
	let enddate = new Date(req.body.end_date);
	
	let query = {$and : [{_id: {$gte: startdate}}, {_id: {$lte: enddate}} ]};
	db_connect
		.collection("notes")
		.find(query)
		.toArray(function (err, result) {
			if (err) throw err;
			res.json(result);
		});
});

routes.route("/note/write").post(function (req, response) {
	let db_connect = dbo.getDb();
	let notes = db_connect.collection("notes");

	let query = { _id: new Date(req.body._id) };
	notes.findOne(query, function (err, res) {
		if (res) {
			let newvalues = {
				$set: {
					content: req.body.content,
					tags: req.body.tags,
				},
			};
			notes.updateOne(query, newvalues, function (err, res) {
				if (err) throw err;
				response.json(res);
			});
		} else {
			let myobj = {
				_id: new Date(req.body._id),
				content: req.body.content,
				tags: req.body.tags,
			};
			db_connect.collection("notes").insertOne(myobj, function (err, res) {
				if (err) throw err;
				response.json(res);
			});
		}
	});
});

module.exports = routes;
