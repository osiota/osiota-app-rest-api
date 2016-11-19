
var express = require('express');

exports.init = function(node, app_config, main, host_info) {
	if (typeof app_config !== "object") {
		app_config = {};
	}
	if (typeof app_config.server !== "number") {
		app_config.server = 8081;
	}

	var app = express();
	app.use (function(req, res, next) {
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
		res.send(
			JSON.stringify(
				main.node(req.path)
			)
		);
	});
	app.post('/*', function(req, res) {
		try {
			var args = JSON.parse(req.body);
			args.push(function(data) {
				res.send(data);
			});
			var n = main.node(req.path);
			console.log("rpc:", args);
			n.rpc.apply(n, args);
		} catch(e) {
			res.send("Exception: "+e);
		}
	});

	var server = app.listen(app_config.server, function () {
	    console.log("Listening on port %s...", server.address().port);
	});

};

