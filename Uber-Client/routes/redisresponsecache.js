const redis = require('redis');

class RedisResponseCache {
    constructor() {
        this.client = redis.createClient();

        this.client.on('connect', () => {
            console.log('Redis is Connected!!!!');
        });

        this.client.on('error', (err) => {
            console.log('Error in Redis client: ' + err);
        });
    }

    getClient() {
        return this.client;
    }
}

module.exports = new RedisResponseCache();
