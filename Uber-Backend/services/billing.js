//billing

var billingSchema = require("./model/billingSchema");
var requestGen = require("./commons/responseGenerator");
var dateFormatter = require("./commons/dateFormatter");
const fetch = require("node-fetch");

//For dynamic algo
const driverSchema = require("./model/driverSchema");
const Billings = billingSchema.Billings; //mongoDB instance

exports.generateBill = async function (msg) {
  const rideId = msg.rideId;
  const customerId = msg.customerId;
  const driverId = msg.driverId;
  const pickUpLocation = msg.pickUpLocation;
  const dropOffLocation = msg.dropOffLocation;
  const rideDate = dateFormatter.dateMMDDYYYYformater(new Date());
  const rideStartTime = new Date(msg.rideStartTime);
  const rideEndTime = new Date(msg.rideEndTime);

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickUpLocation}&destinations=${dropOffLocation}&mode=driving&language=us-EN`,
    );
    const data = await response.json();
    const rideDistance = data.rows[0].elements[0].distance.value * 0.000621371;

    const activeRides = await driverSchema.Drivers.count({ isBusy: true });

    const base_price = 3; // 3$ - minimal rate
    let final_price = 0;

    if (rideDistance > 1) {
      base_price = 1.5 * rideDistance;
    }

    if (activeRides < 5) {
      final_price = base_price;
    } else {
      final_price = base_price + activeRides * 0.2;
    }

    /**	#FOR FUTURE USE
     * 	Disabled this module currently
     */
    //	Change price according to number of available drivers
    /*if(availableDrivers>20) {
    final_price = final_price  - availableDrivers*0.2;
    }
    else if(availableDrivers>15) {
    final_price = final_price  - availableDrivers*0.1;
    }
    else if(availableDrivers>10) {
    final_price = final_price  - availableDrivers*0.05;
    }
    else {
    final_price = final_price  + availableDrivers*0.2;
    }*/

    const day = new Date().getDay(); // It will return number of day in a week
    const hour = new Date().getHours(); // It will return hours 0-23

    if ((day > 5 && hour < 7) || (day > 5 && hour > 21)) {
      if (rideDistance > 1) {
        final_price = final_price + rideDistance;
      } else {
        final_price = final_price + 1;
      }
    }

    if (hour < 7 || hour > 21) {
      if (rideDistance > 1) {
        final_price = final_price + rideDistance;
      } else {
        final_price = final_price + 1;
      }

      if (day > 4 || day == 0) {
        final_price = 1.2 * final_price;
      }
    }

    const newBill = new Billings({
      rideId: rideId,
      rideDate: rideDate,
      rideStartTime: rideStartTime,
      rideEndTime: rideEndTime,
      rideDistance: Number(rideDistance.toFixed(2)),
      rideAmount: Number(final_price.toFixed(2)),
      pickUpLocation: pickUpLocation,
      dropOffLocation: dropOffLocation,
      customerId: customerId,
      driverId: driverId,
    });

    console.log(JSON.stringify(newBill));

    const savedBill = await newBill.save();

    const json_responses = requestGen.responseGenerator(200, savedBill);
    return json_responses;
  } catch (err) {
    const json_responses = requestGen.responseGenerator(500, {
      message: " error generating bill",
    });
    return json_responses;
  }
};

exports.billingSearch = function (msg, callback) {
  var json_response;

  var searchText = msg.searchText;
  var offset = msg.startPosition;

  var data = [];

  Billings.find({
    $or: [
      { rideDate: new RegExp(searchText, "i") },
      { pickUpLocation: new RegExp(searchText, "i") },
      { dropOffLocation: new RegExp(searchText, "i") },
      { customerId: new RegExp(searchText, "i") },
      { driverId: new RegExp(searchText, "i") },
    ],
  })
    .then(function (err, docs) {
      if (err) {
        json_response = requestGen.responseGenerator(401, null);
      } else {
        console.log("docs" + docs);

        docs.forEach(function (doc) {
          data.push({
            billingId: doc.billingId,
            rideId: doc.rideId,
            rideDate: doc.rideDate,
            rideStartTime: doc.rideStartTime,
            rideEndTime: doc.rideEndTime,
            rideDistance: doc.rideDistance,
            rideAmount: doc.rideAmount,
            pickUpLocation: doc.pickUpLocation,
            dropOffLocation: doc.dropOffLocation,
            customerId: doc.customerId,
            driverId: doc.driverId,
          });
        });
        console.log("Billing", data);
        json_response = requestGen.responseGenerator(200, data);
      }
      callback(null, json_response);
    })
    .skip(offset)
    .limit(50);
};

exports.deleteBill = function (msg, callback) {
  var billId = msg.billId;
  var json_responses;

  Billings.remove({ billingId: billId }, function (err, removed) {
    if (err) {
      json_responses = requestGen.responseGenerator(500, {
        message: "Bill delete failed",
      });
    } else {
      if (removed.result.n > 0) {
        json_responses = requestGen.responseGenerator(200, {
          message: "Bill Deleted.",
        });
      } else {
        json_responses = requestGen.responseGenerator(500, {
          message: "Bill Not Found",
        });
      }
    }
    callback(null, json_responses);
  });
};

exports.getBill = function (msg, callback) {
  var billId = msg.billId;

  var json_responses;

  Billings.findOne({ billingId: billId }).then(function (err, bill) {
    if (err) {
      json_responses = requestGen.responseGenerator(500, {
        message: "Error in Bill Finding",
      });
      callback(null, json_responses);
    } else {
      if (bill) {
        json_responses = requestGen.responseGenerator(200, bill);
        callback(null, json_responses);
      } else {
        json_responses = requestGen.responseGenerator(500, {
          message: "No Bill Found",
        });
        callback(null, json_responses);
      }
    }
  });
};
