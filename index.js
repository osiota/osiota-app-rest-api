
var express = require('express');

exports.init = function(node, app_config, main, host_info) {
	if (typeof app_config !== "object") {
		app_config = {};
	}
	if (typeof app_config.server !== "number") {
		app_config.server = 8081;
	}
	var base_path = "";
	if (typeof app_config.base_path === "string") {
		base_path = app_config.base_path.replace(/\/$/, '');
	}

	var router = express.Router();
	// body parser:
	router.use(function(req, res, next) {
		var data='';
		req.setEncoding('utf8');
		req.on('data', function(chunk) {
			data += chunk;
		});

		req.on('end', function() {
			req.body = data;
			next();
		});
	});

	router.get('/*', function(req, res) {
		var path = req.path;
		try {
			path = decodeURIComponent(path);
		} catch(err) {
			res.status(400);
			res.send("Exception: " + e.stack || e);
			return;
		}
		var n = main.node(path);
		console.log("get", path, n.value);
		if (!n.metadata) {
			res.status(404);
			res.send("Node not found.");
			return;
		}
		res.set('Content-Type', 'application/json');
		res.send(
			JSON.stringify(n)
			+"\n"
		);
	});
	router.post('/*', function(req, res) {
		var path = req.path;
		var rpc_method = null;
		try {
			path = decodeURIComponent(path);
		} catch(e) {
			res.status(400);
			res.send("Exception: " + e.stack || e);
			return;
		}
		console.log("post", path);
		var n = main.node(path);
		if (!n.metadata) {
			res.status(404);
			res.send("Node not found.");
			return;
		}
		if (req.query && typeof req.query.method === "string") {
			rpc_method = req.query.method;
		}
		try {
			var args = JSON.parse(req.body);
			if (rpc_method) {
				args = [rpc_method, args];
			}
			if (!Array.isArray(args)) {
				res.status(400);
				res.send("Argument is not an array");
				return;
			}
			args.push(function(err) {
				var args = Array.prototype.slice.call(
					arguments, 1);
				if (err) {
					res.status(500);
					args = {
						"error": err,
						"data": args
					};
				}
				res.set('Content-Type', 'application/json');
				res.send(JSON.stringify(args)+"\n");
			});
			var n = main.node(path);
			console.log("rpc:", args);
			// Add request-object
			if (args[0].match(/^req_/)) {
				args.splice(1, 0, req);
			}
			n.rpc.apply(n, args);
		} catch(e) {
			res.status(422);
			var data = {"error": e.stack || e };
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify(data)+"\n");
		}
	});

	var app = express();
	app.use(base_path, router);

	var server = app.listen(app_config.server, function () {
	    console.log("Listening on port %s...", server.address().port);
	});

	return server;
};

