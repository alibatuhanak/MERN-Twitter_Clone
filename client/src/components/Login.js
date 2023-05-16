import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import "./Login.css";
import { loginUser } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

const Login = ({ setRegister }) => {
	const dispatch = useDispatch();

	const [auth, setAuth] = useState({
		email: "",
		password: "",
	});
	const initialState = {
		email: "",
		password: "",
	};

	const handleChange = e => {
		const { value, name } = e.target;
		setAuth(prevAuth => {
			return {
				...prevAuth,
				[name]: value,
			};
		});
	};

	const handleClick = e => {
		e.preventDefault();
		try {
			dispatch(loginUser(auth));
			setAuth({ ...initialState });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="login_section">
			<div className="login_inputs">
				<h3>Login</h3>
				<input onChange={handleChange} placeholder="Email address" maxLength={40} type="email" name="email" id="email" value={auth.email} />
				<input onChange={handleChange} placeholder="Password" maxLength={40} type="password" name="password" id="password" value={auth.password} />
				<button onClick={handleClick} className="login_button">
					Login
				</button>
				<NavLink style={{ color: "black", textDecoration: "none", fontSize: "0.9rem" }} onClick={() => setRegister(prevRegister => !prevRegister)}>
					Don't have an account ? <span style={{ fontWeight: "400", textDecoration: "underline" }}>Register here</span>
				</NavLink>
			</div>
			<div className="login_social">
				<button className="login_button-social btn-1">
					<FaGoogle style={{ width: "30px", height: "30px", position: "absolute", left: "0", right: "0", margin: "auto", bottom: "10" }} />
				</button>
				<button className="login_button-social btn-2">
					<FaFacebook style={{ width: "30px", height: "30px", position: "absolute", left: "0", right: "0", margin: "auto", bottom: "10" }} />
				</button>
			</div>
		</div>
	);
};

export default Login;
