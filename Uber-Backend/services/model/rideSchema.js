//creating ride model

const mongoose = require("mongoose");

//create ride and related schema using mongoose

const rideSchema = new mongoose.Schema(
  {
    rideId: { type: String, required: true },
    pickUpLocation: { type: String, required: true },
    pickUpLatLong: { type: String, required: true },
    dropOffLocation: { type: String, required: true },
    dropOffLatLong: { type: String, required: true },
    rideStartDateTime: { type: Date },
    rideEndDateTime: { type: Date },
    customerId: { type: String, required: true },
    driverId: { type: String, required: true },
    rideStarted: { type: Boolean, default: false },
    rideDateTime: { type: Date },
    rideCity: { type: String },
  },
  {
    versionKey: false,
  },
);

/*
rideSchema.plugin(autoIncrement.plugin, {
	model: 'Rides',
	field: 'rideId',
	startAt: 1,
	incrementBy: 1
});
*/

// Pre-save middleware to assign a unique rideId based on current count
rideSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next(); // Do nothing if the document is being updated
  }

  try {
    const Counters = mongoose.model("Counters");
    const counter = await Counters.findOneAndUpdate(
      { _id: "rideId" },
      { $inc: { sequenceValue: 1 } },
      { new: true, upsert: true },
    );

    this.rideId = counter.sequenceValue.toString();
    next();
  } catch (error) {
    return next(error);
  }
});

//create Rides model from schema
const Rides = mongoose.model("Rides", rideSchema);

exports.Rides = Rides;
