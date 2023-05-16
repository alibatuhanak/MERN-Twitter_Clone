const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
	name: {
		required: true,
		type: String,
	},

	post: [
		{
			username: {
				type: String,
				required: false,
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
				default: 0,
				required: false,
			},
			image: {
				type: String,
				required: false,
				set: a => (a === "" ? undefined : a),
			},
			postTime: {
				type: Date,
				default: () => Date.now(),
			},
		},
	],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
