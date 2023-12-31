
var express = require('express');

class HTTPError extends Error {
	constructor(status, message) {
		super(message);
		this.name = 'HTTPError';
		this.status = status;
	}
}


var actions = {
	"on": ["set", true],
	"off": ["set", false],
	"toggle": ["toggle"],
};

function map_action(action) {
	if (typeof action !== "string" ||
			typeof actions[action] === "undefined") {
		throw new HTTPError(400, "action not found");
	}
	return JSON.parse(JSON.stringify(actions[action]));
}

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
			throw new HTTPError(400, "Path could not be decoded");
		}
		var n = main.node(path);
		console.log("get", path, n.value);
		if (!n.metadata) {
			throw new HTTPError(404, "Node not found");
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
			throw new HTTPError(400, "URL could not be decoded.");
		}
		console.log("post", path);
		var n = main.node(path);
		if (!n.metadata) {
			throw new HTTPError(404, "Node not found.");
		}
		//if (req.query && typeof req.query.method === "string") {
		//	rpc_method = req.query.method;
		//}
		try {
			var body = JSON.parse(req.body);
		} catch (err) {
			throw new HTTPError(422, "JSON body could not be parsed.");
		}
		if (typeof body !== "object" ||
				body === null) {
			throw new HTTPError(422, "No JSON body");
		}
		let args = [];
		if (typeof body.action === "string") {
			args = map_action(body.action);
		} else {
			if (typeof body.method !== "string") {
				throw new HTTPError(400, "Missing property action or method");
			}
			if (Array.isArray(body.arguments)) {
				args = body.arguments;
			}
			args.unshift(body.method);
		}
		args.push(function(err) {
			var data = Array.prototype.slice.call(
				arguments, 1);
			console.log("REST Answer", err, data);
			if (err) {
				res.status(500);
				data = {
					"error": err,
					"data": data
				};
			}
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify(data)+"\n");
		});
		console.log("rpc:", args);
		// Add request-object
		if (body.method && body.method.match(/^req_/)) {
			args.splice(1, 0, req);
		}
		n.rpc.apply(n, args);
	});

	var app = express();
	app.use(base_path, router);

	// error handler:
	app.use(function (err, req, res, next) {
		console.error("REST Error:", err.stack)
		res
			.status(err.status)
			.send("Error: "+err.message);
	});

	var server = app.listen(app_config.server, function () {
	    console.log("Listening on port %s...", server.address().port);
	});

	return server;
};

