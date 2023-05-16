const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/verifyJWT");
const {
	getPosts,
	addPost,
	updatePost,
	deletePost,
	likePost,
	getLikedPost,
	bookmarkPost,
	getBookmarkedPost,
	changeInfo,
	getAllUsers,
	getUsers,
} = require("../controllers/post");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (file.fieldname === "profile") {
			cb(null, "images/profiles/");
		} else if (file.fieldname === "header") {
			cb(null, "images/headers/");
		} else {
			cb(null, "uploads/");
		}
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
			cb(null, true);
		} else {
			console.log("only jpg png and jpeg");
			cb(null, false);
		}
	},
});

router.get("/getAllUsers", getAllUsers);
router.get("/getUsers", getUsers);
router.get("/getPosts", verifyJWT, getPosts);
router.post("/addPost", verifyJWT, upload.single("file-image"), addPost);
router.patch("/likePost/:id", verifyJWT, likePost);
router.get("/getLikedPost", verifyJWT, getLikedPost);
router.patch("/bookmarkPost/:id", verifyJWT, bookmarkPost);
router.get("/getBookmarkedPost", verifyJWT, getBookmarkedPost);
router.patch(
	"/changeProfile",
	verifyJWT,
	upload.fields([
		{ name: "profile", maxCount: 1 },
		{ name: "header", maxCount: 1 },
	]),
	changeInfo
);

router.patch("/updatePost/:id", verifyJWT, updatePost);
router.patch("/deletePost/:id", verifyJWT, deletePost);

module.exports = router;
