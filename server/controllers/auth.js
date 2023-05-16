const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Auth = require("../models/auth");
const { ACCESS_TOKEN_SECRET } = process.env;

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await Auth.findOne({ email });

		if (!user || email === "") {
			return res.status(500).json({ auth: false, msg: "Account does not found." });
		}

		const passwordCompare = await bcrypt.compare(password, user.password);

		if (!passwordCompare) {
			return res.status(500).json({ auth: false, msg: "Passwords does not match." });
		}

		const AccessToken = await jwt.sign({ user_id: user._id, user_email: user.email, user_username: user.username }, ACCESS_TOKEN_SECRET, {
			expiresIn: "10d",
		});

		res.status(200).json({ auth: true, user, AccessToken, msg: "Login is successful." });
	} catch (error) {
		return res.status(500).json({ auth: false, msg: error });
	}
};

const register = async (req, res) => {
	try {
		const { email, username, password } = req.body;

		const user = await Auth.findOne({ email });
		const user_username = await Auth.findOne({ username });

		if (user) return res.status(500).json({ auth: false, msg: "Email already exist." });

		if (user_username) return res.status(500).json({ auth: false, msg: "Username already exist." });

		if (!isEmail(email)) {
			return res.status(500).json({ auth: false, msg: "Invalid email address." });
		}

		if (username.length === 0) {
			return res.status(500).json({ auth: false, msg: "Invalid username." });
		}
		if (password.length < 8) {
			return res.status(500).json({ auth: false, msg: "Password must greater than 8 characters." });
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const newUser = await Auth.create({ email, username, password: passwordHash });

		const AccessToken = jwt.sign({ user_id: newUser._id, user_email: newUser.email, user_username: newUser.username }, ACCESS_TOKEN_SECRET, {
			expiresIn: "10d",
		});

		res.status(200).json({ auth: true, newUser, AccessToken, msg: "Register is successful. You redirect to login page." });
	} catch (err) {
		return res.status(500).json({ auth: false, msg: err });
	}
};

const isEmail = email => {
	var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
	if (email !== "" && email.match(emailFormat)) {
		return true;
	} else {
		return false;
	}
};
module.exports = { login, register };
