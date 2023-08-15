//creating billing model

const mongoose = require('mongoose');

//create billing and related schema using mongoose

const billingSchema = new mongoose.Schema({
	billingId: {type: String, required: true},
	rideId: {type: String, required: true},
	rideDate:{type: String, required: true},
	pickUpLocation: {type: String, required: true},
	dropOffLocation: {type: String, required: true},
	rideStartTime: {type: String, required: true},
	rideEndTime: {type: String, required: true},
	rideDistance: {type: String, required: true},
	customerId: {type: String, required: true},
	driverId: {type: String, required: true},
	rideAmount: {type: Number, required: true}
}, {
	versionKey : false
});

/*
billingSchema.plugin(autoIncrement.plugin, {
	model: 'Billings',
	field: 'billingId',
	startAt: 1,
	incrementBy: 1
});
*/

// Pre-save middleware to assign a unique billingId based on current count
billingSchema.pre('save', async function (next) {
	if (!this.isNew) {
		return next(); // Do nothing if the document is being updated
	}

	try {
		const Counters = mongoose.model('Counters');
		const counter = await Counters.findOneAndUpdate(
			{ _id: 'billingId' },
			{ $inc: { sequenceValue: 1 } },
			{ new: true, upsert: true }
		);

		this.billingId = counter.sequenceValue.toString();
		next();
	} catch (error) {
		return next(error);
	}
});

//create Billings model from schema
const Billings = mongoose.model('Billings', billingSchema);

exports.Billings = Billings;
