//driver
const driverSchema = require("./model/driverSchema");
const requestGen = require("./commons/responseGenerator");
const fetch = require("node-fetch");
const _ = require("underscore");
const crypto = require("crypto");
const Driver = driverSchema.Driver; //mysql instance
const Drivers = driverSchema.Drivers; //mongoDB instance

exports.registerDriver = function (msg, callback) {
  var email = msg.email;
  var password = msg.password;
  var firstName = msg.firstName;
  var lastName = msg.lastName;
  var ssn = msg.ssn;
  var address = msg.address;
  var city = msg.city;
  var state = msg.state;
  var zipCode = msg.zipCode;
  var phoneNumber = msg.phoneNumber;
  //    var carDetails = msg.carDetails;

  var salt = "!@12MySeCrEtSALTsTrInG!@12";
  var newPassword = crypto
    .createHash("sha512")
    .update(salt + password + salt)
    .digest("hex");

  var json_responses;

  //add data in mysql
  Driver.create({
    //id - autoIncrement by default by sequelize
    email: email,
    password: newPassword,
    firstName: firstName,
    lastName: lastName,
    ssn: ssn,
    address: address,
    city: city,
    state: state,
    zipCode: zipCode,
    phoneNumber: phoneNumber,
    //       carDetails: carDetails
  }).then(function (driver) {
    //add data in mongodb
    var newDriver = new Drivers({
      driId: driver.driver_id,
      firstName: firstName,
      lastName: lastName,
      email: email,
    });

    newDriver.save().then(function (err) {
      if (err) {
        json_responses = requestGen.responseGenerator(500, {
          message: "error registering driver",
        });
      } else {
        json_responses = requestGen.responseGenerator(200, {
          message: "driver registration successfull",
        });
      }
      callback(null, json_responses);
    });
  });
};

exports.loginDriver = function (msg, callback) {
  var email = msg.email;
  var password = msg.password;

  var json_responses;

  var salt = "!@12MySeCrEtSALTsTrInG!@12";
  var newPassword = crypto
    .createHash("sha512")
    .update(salt + password + salt)
    .digest("hex");

  Driver.findOne({
    attributes: ["email", "password"],
    where: { email: email, password: newPassword },
  }).then(function (user) {
    console.log(JSON.stringify(user));
    if (user) {
      json_responses = requestGen.responseGenerator(200, {
        message: "driver login successful",
        user: user.email,
      });
    } else {
      json_responses = requestGen.responseGenerator(401, {
        message: "driver login failed",
      });
    }
    callback(null, json_responses);
  });
};

exports.searchDriver = function (msg, callback) {
  var search = msg.search;
  var offset = msg.startPosition;

  Driver.findAll({
    where: {
      $or: [
        {
          email: { $like: "%" + search + "%" },
        },
        {
          firstName: { $like: "%" + search + "%" },
        },
        {
          lastName: { $like: "%" + search + "%" },
        },
        {
          address: { $like: "%" + search + "%" },
        },
        {
          city: { $like: "%" + search + "%" },
        },
        {
          state: { $like: "%" + search + "%" },
        },
        {
          zipCode: { $like: "%" + search + "%" },
        },
        {
          phoneNumber: { $like: "%" + search + "%" },
        },
        {
          carDetails: { $like: "%" + search + "%" },
        },
      ],
    },
    order: [["driver_id", "ASC"]],
    offset: offset,
    limit: 50,
  }).then(function (drivers) {
    var json_responses;
    if (drivers) {
      json_responses = requestGen.responseGenerator(200, drivers);
    } else {
      json_responses = requestGen.responseGenerator(500, {
        message: "No driver details found.",
      });
    }
    callback(null, json_responses);
  });
};

exports.deleteDriver = function (msg, callback) {
  var email = msg.email;
  var json_responses;
  console.log(email + " email");
  Driver.destroy({ where: { email: email } }).then(function (affectedRows) {
    if (affectedRows > 0) {
      console.log("first if");
      Drivers.remove({ email: email }, function (err, removed) {
        if (err) {
          json_responses = requestGen.responseGenerator(500, {
            message: "driver delete failed",
          });
        } else {
          if (removed.result.n > 0) {
            console.log("last if");
            json_responses = requestGen.responseGenerator(200, {
              message: "Driver Deleted.",
            });
          } else {
            console.log("first else");
            json_responses = requestGen.responseGenerator(500, {
              message: "No Driver Found",
            });
          }
        }
        callback(null, json_responses);
      });
    } else {
      console.log("last else");
      json_responses = requestGen.responseGenerator(500, {
        message: "No Driver Found",
      });
      callback(null, json_responses);
    }
  });
};

exports.getDriversInRange = function (msg, callback) {
  var json_responses;

  Driver.findAll({ verifyStatus: true, isBusy: false }).then(
    function (drivers) {
      if (drivers.length > 0) {
        Drivers.find({ verifyStatus: true, isBusy: false })
          .lean()
          .then(function (driver) {
            var filterDriver = [];

            if (driver.length > 0) {
              var mergedDriverList = _.map(drivers, function (item) {
                var order = _.find(driver, function (driver) {
                  return item.dataValues.email == driver.email;
                });
                return _.extend(item.dataValues, order);
              });

              var dist = {},
                point = {};
              for (
                var intPoint = 0;
                intPoint < mergedDriverList.length;
                intPoint = intPoint + 1
              ) {
                point = mergedDriverList[intPoint];
                console.log(point);
                dist = distance({
                  lat1: msg.currentLat,
                  lon1: msg.currentLng,
                  lat2: point.latitude,
                  lon2: point.longitude,
                });
                if (dist.m < 10) {
                  point.distance = dist.m;
                  filterDriver.push(point);
                }
                console.log("Positions:", JSON.stringify(dist));
              }

              json_responses = requestGen.responseGenerator(200, filterDriver);
              callback(null, json_responses);
            } else {
              json_responses = requestGen.responseGenerator(
                500,
                "No Driver found",
              );
              callback(null, json_responses);
            }
          });
      } else {
        json_responses = requestGen.responseGenerator(500, {
          data: "No Driver found",
        });
        callback(null, json_responses);
      }
    },
  );
};

function distance(obj) {
  var R = 6371; // km
  var dLat = ((obj.lat2 - obj.lat1) * Math.PI) / 180;
  var dLon = ((obj.lon2 - obj.lon1) * Math.PI) / 180;
  var lat1 = (obj.lat1 * Math.PI) / 180;
  var lat2 = (obj.lat2 * Math.PI) / 180;

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  var m = d * 0.621371;
  return {
    km: d,
    m: m,
  };
}

exports.getDriverInformation = function (msg, callback) {
  var email = msg.email;
  var json_responses;
  console.log(email);
  Driver.findOne({ where: { email: email }, raw: true }).then(
    function (driver) {
      console.log(email);
      if (driver) {
        //console.log("driver from sql " + JSON.stringify(driver));

        Drivers.findOne({ email: email })
          .lean()
          .then(function (drivers) {
            if (drivers) {
              //console.log("driver from mongodb " + JSON.stringify(drivers));
              json_responses = requestGen.responseGenerator(
                200,
                drivers,
                driver,
              );
            } else {
              json_responses = requestGen.responseGenerator(200, driver, {
                message: "No rides found!",
              });
            }
            callback(null, json_responses);
          });
      } else {
        json_responses = requestGen.responseGenerator(500, {
          message: "No Driver found",
        });
      }
      //callback(null, json_responses);
    },
  );
};

exports.updateDriver = function (msg, callback) {
  var email = msg.email;
  var password = msg.password;
  var firstName = msg.firstName;
  var lastName = msg.lastName;
  var address = msg.address;
  var city = msg.city;
  var state = msg.state;
  var zipCode = msg.zipCode;
  var phoneNumber = msg.phoneNumber;
  var carDetails = msg.carDetails;

  var json_responses;

  Driver.update(
    {
      password: password,
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      state: state,
      zipCode: zipCode,
      phoneNumber: phoneNumber,
      carDetails: carDetails,
    },
    { where: { email: email } },
  ).then(function (driver) {
    if (driver) {
      Drivers.update(
        { email: email },
        { $set: { firstName: firstName, lastName: lastName } },
        function (err, drivers) {
          if (drivers) {
            Driver.findOne({ where: { email: email } }).then(function (driver) {
              var json_responses;
              if (driver) {
                json_responses = requestGen.responseGenerator(200, driver);
              } else {
                json_responses = requestGen.responseGenerator(500, {
                  message: "No Driver found",
                });
              }
              callback(null, json_responses);
            });
          } else {
            json_responses = requestGen.responseGenerator(500, {
              message: "Driver Not found",
            });
            callback(null, json_responses);
          }
        },
      );
    }
  });
};

exports.updateDriverDetails = async function (msg) {
  const email = msg.email;
  const vehicleType = msg.vehicleType;
  const numberPlate = msg.numberPlate;
  const license = msg.license;
  const currentLocation = msg.currentLocation;
  const videoURL = msg.videoURL;

  const carDetails = `Car Type: ${vehicleType}  Car Number: ${numberPlate}`;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${currentLocation}`,
    );
    const data = await response.json();
    const city = findResult(data.results[0].address_components, "locality");
    const location = data.results[0].geometry.location;
    const latitude = location.lat;
    const longitude = location.lng;

    const driver = await Driver.update(
      {
        carDetails: carDetails,
        videoURL: videoURL,
        license: license,
      },
      { where: { email: email } },
    );

    if (driver) {
      const updatedDriver = await driverSchema.Drivers.updateOne(
        { email: email },
        {
          $set: {
            currentLocation: currentLocation,
            latitude: latitude,
            longitude: longitude,
          },
        },
      );

      if (updatedDriver.modifiedCount > 0) {
        const json_responses = requestGen.responseGenerator(200, {
          message: "Success",
        });
        return json_responses;
      } else {
        const json_responses = requestGen.responseGenerator(500, {
          message: "No Driver found in MongoDB",
        });
        return json_responses;
      }
    } else {
      const json_responses = requestGen.responseGenerator(500, {
        message: "No Driver found",
      });
      return json_responses;
    }
  } catch (err) {
    const json_responses = requestGen.responseGenerator(500, {
      message: "Error saving driver",
    });
    return json_responses;
  }
};

var findResult = function (results, name) {
  var result = _.find(results, function (obj) {
    return obj.types[0] == name && obj.types[1] == "political";
  });
  return result ? result.short_name : null;
};

exports.checkDriverEmail = function (msg, callback) {
  var email = msg.email;

  var json_response;

  Driver.findAll({ where: { email: email } }).then(function (drivers) {
    if (drivers.length > 0) {
      json_response = requestGen.responseGenerator(500, null);
    } else {
      json_response = requestGen.responseGenerator(200, null);
    }

    callback(null, json_response);
  });
};

exports.getDriverRating = function (msg, callback) {
  var emailId = msg.emailId;
  var json_response;

  Drivers.findOne({ email: emailId }, function (err, doc) {
    console.log(doc);
    if (err) {
      console.log("error getting ratings");
      json_response = requestGen.responseGenerator(401, null);
      callback(null, json_response);
    } else {
      if (doc) {
        var driRating = [];
        var total = 0;
        var count = doc.rides.length;
        var Avg = 0;
        var newCount = 0;
        for (var i = 0; i < count; i++) {
          //console.log(i + " " + doc.rides[i].rating);
          if (typeof doc.rides[i].rating != "undefined") {
            console.log("new i" + i);
            //riRating.push(doc.rides[i].rating);
            total += doc.rides[i].rating;
            newCount++;
          }
        }
        //console.log("total " + total);
        Avg = total / newCount;
        //console.log("avg " + Avg );
        //console.log("number " + Number(Avg).toFixed(1));
        json_response = requestGen.responseGenerator(200, {
          data: Number(Avg).toFixed(1),
        });
        callback(null, json_response);
      }
    }
  });
};

exports.checkDriverSSN = function (msg, callback) {
  var ssn = msg.ssn;

  var json_response;

  Driver.findAll({ where: { ssn: ssn } }).then(function (drivers) {
    //console.log("email customers " + customers);

    if (drivers.length > 0) {
      json_response = requestGen.responseGenerator(500, null);
    } else {
      json_response = requestGen.responseGenerator(200, null);
    }

    callback(null, json_response);
  });
};
