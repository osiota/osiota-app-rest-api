
exports.init = function(node, app_config, main) {

	node.announce({
		"type": "test-rest.app"
	});
	node.publish(undefined, "Hello World!");

	node.on_rpc("test", function(reply, args) {
		reply(null, "okay", args);
	});

	console.log(node.name, JSON.stringify(node));

	return node;
}
