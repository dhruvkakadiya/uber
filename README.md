# Uber Simulation
Uber simulation using backend and client separate components.

## Dependencies
1. Mac/Linux/Windows OS
2. [Node](https://nodejs.org/en)
3. [MySQL](https://www.mysql.com/)
4. [MongoDB](https://www.mongodb.com/)
5. [Redis](https://redis.com/)
6. [RabbitMQ](https://www.rabbitmq.com/)

## Getting started for Mac
1. Install dependencies using brew
```bash
brew install mongodb mysql rabbitmq redis node
```
2. Alternatively use their own website to download relevant .dmg package
installers and install them.

3. Make sure all services are started
```bash
brew services start mongodb
brew services start mysql
brew services start rabbitmq
brew services start redis
```

4. If required services have been started or not, can be verified using command
```bash
ps ax | grep mongod
ps ax | grep mysqld
ps ax | grep rabbitmq
ps ax | grep redis
```

5. Clone repository
```bash
git clone git@github.com:dhruvkakadiya/uber.git
```

6. Open new terminal and start backend
```bash
cd uber/Uber-Backend && npm install && npm start
```

7. Open new terminal and start client
```bash
cd uber/Uber-Client && npm install && npm start
```

8. Open link in your favorite browser
```bash
http://localhost:3000
```
