
var express = require('express');

exports.init = function(node, app_config, main, host_info) {
	if (typeof app_config !== "object") {
		app_config = {};
	}
	if (typeof app_config.server !== "number") {
		app_config.server = 8081;
	}

	var app = express();
	app.use(function(req, res, next) {
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

	app.get('/*', function(req, res) {
		var path = req.path;
		try {
			path = decodeURIComponent(path);
		} catch(err) {
			res.send("Exception: " + e.stack || e);
			return;
		}
		console.log("get", path, main.node(path).value);
		res.send(
			JSON.stringify(
				main.node(path)
			)
		);
	});
	app.post('/*', function(req, res) {
		var path = req.path;
		var rpc_method = null;
		try {
			path = decodeURIComponent(path);
		} catch(e) {
			res.send("Exception: " + e.stack || e);
			return;
		}
		var m = path.match(/^(.*?)\?(.*)$/);
		if (m) {
			path = m[1];
			rpc_method = m[2];
		}
		console.log("post", path);
		try {
			var args = JSON.parse(req.body);
			if (rpc_method) {
				args = [rpc_method, args];
			}
			if (!Array.isArray(args)) {
				return;
			}
			// Add request-object
			if (args[0].match(/^req_/)) {
				args.unshift(req);
			}
			args.push(function(err, data) {
				if (err) {
					res.send("Error: "+err + "\n" + data);
					return;
				}
				res.send(data);
			});
			var n = main.node(path);
			console.log("rpc:", args);
			n.rpc.apply(n, args);
		} catch(e) {
			res.send("Exception: " + e.stack || e);
		}
	});

	var server = app.listen(app_config.server, function () {
	    console.log("Listening on port %s...", server.address().port);
	});

	return server;
};

