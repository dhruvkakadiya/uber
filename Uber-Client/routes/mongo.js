const { MongoClient } = require("mongodb");
let db;
let connected = false;

exports.connect = async function (url) {
  try {
    db = await MongoClient.connect(url);
    console.log("Successfully connected to MongoDB");
    connected = true;
  } catch (error) {
    throw new Error("Could not connect: " + error);
  }
};

exports.collection = function (name) {
  if (!connected) {
    throw new Error('Must connect to Mongo before calling "collection"');
  }
  return db.collection(name);
};

exports.close = async function () {
  if (connected) {
    await db.close();
    connected = false;
  }
};
