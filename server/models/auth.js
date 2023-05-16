const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	profile: {
		profilePhoto: {
			type: Object,
			required: false,
		},
		headerPhoto: {
			type: Object,
			required: false,
		},
	},
	likedPost: [
		{
			username: {
				type: String,
				required: true,
			},
			profilePhoto: {
				type: Object,
				required: false,
			},
			text: {
				type: String,
				required: true,
			},
			like: {
				type: Number,
				required: true,
			},
			image: {
				type: String,
				required: false,
				set: a => (a === "" ? undefined : a),
			},
			postTime: {
				type: Date,
				required: true,
			},
		},
	],
	bookmark: [
		{
			username: {
				type: String,
				required: true,
			},
			profilePhoto: {
				type: Object,
				required: false,
			},
			text: {
				type: String,
				required: true,
			},
			like: {
				type: Number,
				required: true,
			},
			image: {
				type: String,
				required: false,
				set: a => (a === "" ? undefined : a),
			},
			postTime: {
				type: Date,
				required: true,
			},
		},
	],
	date: {
		type: Date,
		default: () => Date.now(),
	},
});

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;
