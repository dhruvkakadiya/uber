const amqp = require('amqp');
const redisCache = require('../routes/redisresponsecache');
var connection = amqp.createConnection({
	host : '127.0.0.1'
});
const rpc = new (require('./amqprpc'))(connection);
let outstanding = 0; // counter of outstanding requests

function make_request(queue_name, msg_payload, callback) {
	outstanding += 1;
	const redis = redisCache.getClient();
	// check for response cache
	if (msg_payload.reqtype == "search") {
		console.log("GOING FOR REDIS SEARCH");
		const key = `uber:${msg_payload.reqtype}/${msg_payload.data.operation}/${msg_payload.data.searchparam}`;
		redis.get(key).then((data) => {
			if (data != null && data.length != 0 && data != undefined) {
				console.log("cached Response");
				callback(null, JSON.parse(data))
			}
			else {
				console.log("GOING FOR AMQP RPC");
				rpc.makeRequest(queue_name,msg_payload, function(err, response) {
					if (err) {
						console.error(err);
					}
					else {
						// cache response
						console.log('Caching data');
						redis.set(key, JSON.stringify(response));
						redis.expire(key, 120);
						console.log('Caching complete');
						callback(null,response);
					}
					outstanding -= 1;
				});
			}
		  }).catch((err) => {
			console.error(err);
		  });
	}
	else {
		console.log("GOING FOR AMQP RPC");
		rpc.makeRequest(queue_name, msg_payload, function(err, response) {
			if (err)
				console.error(err);
			else {
				console.log("response", response);
				callback(null, response);
			}
		});
	}
}

exports.make_request = make_request;
