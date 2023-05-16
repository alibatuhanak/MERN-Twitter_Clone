const jwt = require("jsonwebtoken");
require("dotenv").config();

const { ACCESS_TOKEN_SECRET } = process.env;

const verifyJWT = async (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"]?.split(" ")[1];

		if (!authHeader) {
			return res.status(500).json({ auth: false, msg: "Token required." });
		}
		jwt.verify(authHeader, ACCESS_TOKEN_SECRET, (err, decoded) => {
			if (err) {
				return res.status(500).json({ auth: false, msg: "Token expired." });
			}
			req.userJWT = decoded;
			next();
		});
	} catch (error) {
		return res.status(500).json({ auth: false, msg: error });
	}
};

module.exports = verifyJWT;
