/**
 * New node file
 */
// super simple rpc server example
var amqp = require("amqp");
var util = require("util");

var customer = require("./services/customer");
var driver = require("./services/driver");
var admin = require("./services/admin");
var ride = require("./services/ride");
var billing = require("./services/billing");

var cnn = amqp.createConnection({
  host: "127.0.0.1",
});

//var options = {
//	server: { poolSize: 5 }
//};

// help me writing proper mongoose connection code

const mongoose = require("mongoose");
const config = require("./services/commons/config");
const option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000, // New option in the latest MongoDB driver
  keepAlive: true,
  keepAliveInitialDelay: 300000, // New option in the latest MongoDB driver
};
mongoose.connect(config.mongodbUri, option).then(
  () => console.log("MongoDB connected!"),
  (error) => console.log("MongoDB error"),
);
const connection = mongoose.connection;

cnn.on("ready", function () {
  console.log("listening on customer_queue");

  cnn.queue("customer_queue", function (q) {
    q.subscribe(function (message, headers, deliveryInfo, m) {
      util.log("customer_queue: ");
      util.log(util.format(deliveryInfo.routingKey, message));
      util.log("Message: " + JSON.stringify(message));
      util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

      switch (message.func) {
        case "registerCustomer":
          customer.registerCustomer(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "loginCustomer":
          customer.loginCustomer(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "deleteCustomer":
          customer.deleteCustomer(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "listAllCustomers":
          customer.listAllCustomers(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "addImagesToRide":
          customer.addImagesToRide(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "getCustomerInformation":
          customer.getCustomerInformation(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "getImagesOfRide":
          customer.getImagesOfRide(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "updateCustomer":
          customer.updateCustomer(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "checkCustomerEmail":
          customer.checkCustomerEmail(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "searchCustomer":
          customer.searchCustomer(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "getCustomerRating":
          customer.getCustomerRating(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "checkCustomerSSN":
          customer.checkCustomerSSN(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
      }
    });
  });

  console.log("listening on driver_queue");
  cnn.queue("driver_queue", function (q) {
    q.subscribe(function (message, headers, deliveryInfo, m) {
      util.log("driver_queue: ");
      util.log(util.format(deliveryInfo.routingKey, message));
      util.log("Message: " + JSON.stringify(message));
      util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

      switch (message.func) {
        case "registerDriver":
          driver.registerDriver(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "loginDriver":
          driver.loginDriver(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "searchDriver":
          driver.searchDriver(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "deleteDriver":
          driver.deleteDriver(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "updateDriver":
          driver.updateDriver(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "getDriverInformation":
          driver.getDriverInformation(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "updateDriverDetails":
          driver.updateDriverDetails(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "getDriversInRange":
          driver.getDriversInRange(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "checkDriverEmail":
          driver.checkDriverEmail(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "getDriverRating":
          driver.getDriverRating(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "checkDriverSSN":
          driver.checkDriverSSN(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
      }
    });
  });

  console.log("listening on admin_queue");
  cnn.queue("admin_queue", function (q) {
    q.subscribe(function (message, headers, deliveryInfo, m) {
      util.log("admin_queue: ");
      util.log(util.format(deliveryInfo.routingKey, message));
      util.log("Message: " + JSON.stringify(message));
      util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

      switch (message.func) {
        case "registerAdmin":
          admin.registerAdmin(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "loginAdmin":
          admin.loginAdmin(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "verifyDrivers":
          admin.verifyDrivers(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "verifyCustomers":
          admin.verifyCustomers(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "showDrivers":
          admin.showDrivers(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "showCustomers":
          admin.showCustomers(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "ignoreDrivers":
          admin.ignoreDrivers(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "ignoreCustomers":
          admin.ignoreCustomers(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "showCustomersForApproval":
          admin.showCustomersForApproval(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "showDriversForApproval":
          admin.showDriversForApproval(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "revenuePerDayWeekly":
          admin.revenuePerDayWeekly(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "ridesPerArea":
          admin.ridesPerArea(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
      }
    });
  });

  console.log("listening on ride_queue");
  cnn.queue("ride_queue", function (q) {
    q.subscribe(function (message, headers, deliveryInfo, m) {
      util.log("ride_queue: ");
      util.log(util.format(deliveryInfo.routingKey, message));
      util.log("Message: " + JSON.stringify(message));
      util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
      switch (message.func) {
        case "createRide":
          ride.createRide(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "RideInfo":
          ride.getRideInformation(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "updateRide":
          ride.updateRide(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "deleteRide":
          ride.deleteRide(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "customerRideList":
          ride.customerRideList(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "driverRideList":
          ride.driverRideList(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "startRide":
          ride.startRide(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "endRide":
          ride.endRide(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
        case "getRideInfo":
          ride.getRideInfo(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "rateDriver":
          ride.rateDriver(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "rateCustomer":
          ride.rateCustomer(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "cityList":
          ride.cityList(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "cityRides":
          ride.cityRides(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "driverRides":
          ride.driverRides(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "customerRides":
          ride.customerRides(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
      }
    });
  });

  console.log("listening on bill_queue");
  cnn.queue("bill_queue", function (q) {
    q.subscribe(function (message, headers, deliveryInfo, m) {
      util.log("bill_queue: ");
      util.log(util.format(deliveryInfo.routingKey, message));
      util.log("Message: " + JSON.stringify(message));
      util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
      switch (message.func) {
        case "generateBill":
          billing.generateBill(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "billingSearch":
          billing.billingSearch(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "deleteBill":
          billing.deleteBill(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;

        case "getBill":
          billing.getBill(message, function (err, res) {
            util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, res, {
              contentType: "application/json",
              contentEncoding: "utf-8",
              correlationId: m.correlationId,
            });
          });
          break;
      }
    });
  });
});
