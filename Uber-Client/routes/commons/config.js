module.exports = {
  mongodbUri: process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/neuber",
  sessionUri: process.env.SESSION_URI || "mongodb://0.0.0.0:27017/sessions",
  // other configuration properties
};
