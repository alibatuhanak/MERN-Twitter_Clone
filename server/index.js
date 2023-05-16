const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { MONGO_URI } = process.env;
const { PORT } = process.env;
const AuthRouter = require("./routes/auth");
const PostRouter = require("./routes/post");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connect = async (req, res) => {
	try {
		await mongoose.connect(MONGO_URI, { dbName: "userDB", useNewUrlParser: true, useUnifiedTopology: true });
		console.log("Database connected.");
	} catch (error) {
		console.log("Database connection failed");
		console.log(error);
	}
};

connect();

app.use("/auth", AuthRouter);
app.use("/post", PostRouter);

app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
app.use("/images/headers", express.static(path.join(__dirname + "/images/headers")));
app.use("/images/profiles", express.static(path.join(__dirname + "/images/profiles")));

app.listen(PORT, (req, res) => {
	console.log(`Server is running on port ${PORT}.`);
});
