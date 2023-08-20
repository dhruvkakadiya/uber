const redis = require("redis");

let redisClient;

(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));

  await redisClient.connect();
})();

function getClient() {
  return redisClient;
}

exports.getClient = getClient;
