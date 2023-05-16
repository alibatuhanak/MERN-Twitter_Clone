import React, { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import "./Auth.css";

const Auth = () => {
	const [register, setRegister] = useState(false);

	return (
		<div className="auth_section">
			<div className="sign_section">
				<img className="sign_img" src="assets/ocean.jpg" alt="signUpPhoto" />
				{!register ? <Login setRegister={setRegister} register={register} /> : <Register setRegister={setRegister} register={register} />}
			</div>
		</div>
	);
};

export default Auth;
