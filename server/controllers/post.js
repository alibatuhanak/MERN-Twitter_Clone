const mongoose = require("mongoose");
const Post = require("../models/post");
const Auth = require("../models/auth");

const getAllUsers = async (req, res) => {
	try {
		const getUsers = await Auth.find({}, { username: 1 });
		res.status(200).json({ userStatus: true, msg: "All users uploaded successfully.", users: getUsers });
	} catch (error) {
		return res.status(500).json({ userStatus: false, msg: error });
	}
};
const getUsers = async (req, res) => {
	try {
		const getUsers = await Auth.find({});
		res.status(200).json({ userStatus: true, msg: "All users uploaded successfully.", users: getUsers });
	} catch (error) {
		return res.status(500).json({ userStatus: false, msg: error });
	}
};

const getPosts = async (req, res) => {
	try {
		const getPostData = await Post.aggregate([
			{
				$group: {
					_id: null,
					post: {
						$push: "$post",
					},
				},
			},
			{
				$project: {
					allPost: {
						$reduce: {
							input: "$post",
							initialValue: [],
							in: {
								$concatArrays: ["$$value", "$$this"],
							},
						},
					},
				},
			},
		]);

		res.status(200).json({
			postStatus: true,
			msg: "Posts uploaded successfully.",
			postData: getPostData[0].allPost.sort((a, b) => a.postTime - b.postTime),
		});
	} catch (error) {
		return res.status(500).json({ auth: false, msg: "We're having trouble updating posts.", postData: null, error });
	}
};

const addPost = async (req, res) => {
	try {
		const { user_username } = req.userJWT;

		const { text } = req.body;

		const filename = req?.file?.filename;

		//

		const getUser = await Post.findOne({ name: user_username });
		const getProfile = await Auth.findOne({ username: user_username });
		const { profilePhoto } = getProfile.profile;

		if (!getUser) {
			const addNewUserData = await Post.create({
				name: user_username,
				post: [{ username: user_username, text, image: filename, profilePhoto: profilePhoto }],
			});
			console.log(addNewUserData);
			return res.status(200).json({ postStatus: true, msg: "Post created successfully.", postData: addNewUserData.post.slice(-1) });
		}
		const addPostData = await Post.findOneAndUpdate(
			{ name: user_username },
			{
				$push: {
					post: [{ username: user_username, text, image: filename, profilePhoto }],
				},
			},
			{ new: true }
		);
		res.status(200).json({ postStatus: true, msg: "Post created successfully.", postData: addPostData.post.slice(-1) });
	} catch (error) {
		return res.status(500).json({ auth: false, msg: "We're having trouble creating post.", error });
	}
};

const likePost = async (req, res) => {
	try {
		const { id } = req.params;
		const { user_username } = req.userJWT;

		const likeControl = await Auth.findOne({ username: user_username, "likedPost._id": id });
		if (likeControl) {
			const dislike = await Post.findOneAndUpdate(
				{
					"post._id": id,
				},
				// $ first target
				{
					$inc: {
						"post.$[p].like": -1,
					},
				},
				{
					arrayFilters: [
						{
							"p._id": id,
						},
					],
					new: true,
				}
			);

			const _dislike = dislike.post.find(item => item._id == id);
			console.log(_dislike);

			await Auth.findOneAndUpdate(
				{ username: user_username },
				{
					$pull: {
						likedPost: { _id: id },
					},
				},
				{ new: true }
			);

			return res.status(200).json({ postStatus: true, msg: "Post dislike successfully.", id, postData: _dislike, likeStatus: false });
		}

		if (!likeControl) {
			const like = await Post.findOneAndUpdate(
				{ "post._id": id },
				{
					$inc: {
						"post.$[p].like": 1,
					},
				},
				{
					arrayFilters: [
						{
							"p._id": id,
						},
					],
					new: true,
				}
			);
			const _like = like.post.find(item => item._id == id);

			await Auth.findOneAndUpdate(
				{ username: user_username },
				{
					$push: {
						likedPost: [_like],
					},
				},
				{
					// arrayFilters: {
					// 	"a._id": user_id,
					// },
					new: true,
				}
			);
			return res.status(200).json({ postStatus: true, msg: "Post liked successfully.", id, postData: _like, likeStatus: true });
		} else {
		}
	} catch (error) {
		return res.status(500).json({ postStatus: false, msg: "We're having trouble like post.", error });
	}
};

const getLikedPost = async (req, res) => {
	try {
		const { user_username } = req.userJWT;
		const getLikedPosts = await Auth.findOne({ username: user_username });
		res.status(200).json({ postStatus: true, msg: "Liked posts  uploaded successfully.", likedPostData: getLikedPosts.likedPost });
	} catch (error) {
		res.status(500).json({ postStatus: false, msg: "We're having trouble updating liked post.", error });
	}
};

const bookmarkPost = async (req, res) => {
	const { id } = req.params;
	const { user_username } = req.userJWT;
	try {
		const bookmarkControl = await Auth.findOne({ username: user_username, "bookmark._id": id });
		if (bookmarkControl) {
			const disBookmark = await Post.findOne({ "post._id": id });

			const _disBookmark = disBookmark.post.find(x => x._id == id);

			await Auth.findOneAndUpdate(
				{
					username: user_username,
				},
				{
					$pull: {
						bookmark: {
							_id: id,
						},
					},
				},
				{ new: true }
			);

			return res.status(200).json({ postStatus: true, msg: "Post Disbookmarked successfully.", id, postData: _disBookmark, bookmarkStatus: false });
		} else if (!bookmarkControl) {
			const bookmark = await Post.findOne({ "post._id": id });
			const _bookmark = bookmark.post.find(x => x._id == id);

			await Auth.findOneAndUpdate(
				{
					username: user_username,
				},
				{
					$push: {
						bookmark: [_bookmark],
					},
				},
				{ new: true }
			);

			return res.status(200).json({ postStatus: true, msg: "Post Disbookmarked successfully.", id, postData: _bookmark, bookmarkStatus: true });
		}
	} catch (error) {
		return res.status(500).json({ postStatus: false, msg: "We're having trouble getting bookmark post.", error });
	}
};

const getBookmarkedPost = async (req, res) => {
	try {
		const { user_username } = req.userJWT;
		const getBookmarkedPost = await Auth.findOne({ username: user_username });
		res.status(200).json({ postStatus: true, msg: "Bookmarked posts uploaded successfully.", bookmarkedPostData: getBookmarkedPost.bookmark });
	} catch (error) {
		return res.status(500).json({ postStatus: false, msg: "We're having trouble updating bookmarked posts", error });
	}
};

const uploadImage = async (req, res) => {
	try {
		console.log(req.body);
		const files = req.files.profile[0].filename;
		console.log(files);
		res.json({ msg: "image uploaded", body: req.body, file: req.file });
	} catch (error) {
		return res.status(500).json(error);
	}
};

const changeInfo = async (req, res) => {
	try {
		const { user_username } = req.userJWT;
		const { profile, header } = req.files;
		console.log(req.body);

		await Post.findOneAndUpdate(
			{ name: user_username },
			{
				$set: {
					"post.$[p].profilePhoto": profile,
				},
			},
			{ arrayFilters: [{ "p.username": user_username }], new: true }
		);
		const changePhotos = await Auth.findOneAndUpdate(
			{ username: user_username },
			{
				$set: {
					"profile.profilePhoto": profile,
					"profile.headerPhoto": header,
					"likedPost.$profilePhoto": profile,
					"bookmark.$profilePhoto": profile,
				},
			},
			{ new: true }
		);
		return res.status(200).json({ changeInfoStatus: true, msg: "Header photo changed successfully.", info: changePhotos.profile });
	} catch (error) {
		return res.status(500).json({ changeInfoStatus: false, msg: "We're having trouble changing images and name.", error });
	}
};

const updatePost = async (req, res) => {
	try {
		const { id } = req.params;
		const { user_username } = req.userJWT;

		const updatedPostData = await Post.findOneAndUpdate(
			{ username: user_username },
			{
				$set: { "post.$[p].text": req.body.ali },
			},
			{
				arrayFilters: [
					{
						"p._id": id,
					},
				],
				new: true,
			}
		);

		res.json({ postStatus: true, postData: updatedPostData });
	} catch (error) {
		return res.status(500).json({ auth: false, msg: error });
	}
};

const deletePost = async (req, res) => {
	try {
		const { id } = req.params;
		const { user_username } = req.userJWT;

		const deletedPostData = await Post.findOneAndUpdate(
			{
				username: user_username,
			},
			{
				$pull: {
					post: {
						_id: id,
					},
				},
			},
			{ new: true }
		);
		res.status(200).json({ postStatus: true, postData: deletedPostData });
	} catch (error) {
		return res.status(500).json({ auth: false, msg: error });
	}
};

module.exports = {
	getAllUsers,
	getUsers,
	getPosts,
	addPost,
	updatePost,
	deletePost,
	likePost,
	getLikedPost,
	uploadImage,
	bookmarkPost,
	getBookmarkedPost,
	changeInfo,
};
// const updatePostData = await Post.findByIdAndUpdate(
//     { _id: user_id },
//     {
//         $set: { "post.$[p].text": "dasdasdas", "post.$[p].title": "dddddddddddddddd" },
//     },
//     {
//         arrayFilters: [
//             {
//                 "p._id": id,
//             },
//         ],
//     }
// );
