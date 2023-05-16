import React, { useState } from "react";
import "./Register.css";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { registerUser } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Register = ({ setRegister, register }) => {
	const dispatch = useDispatch();
	const user = useSelector(state => state.auth);

	const [auth, setAuth] = useState({
		email: "",
		username: "",
		password: "",
	});

	const handleChange = e => {
		const { name, value } = e.target;
		setAuth(prevAuth => {
			return {
				...prevAuth,
				[name]: value,
			};
		});
	};

	const handleClick = e => {
		try {
			e.preventDefault();
			dispatch(registerUser(auth));
			if (!user.loading && user.auth) {
				setAuth({ email: "", username: "", password: "" });
			}
		} catch (error) {
			console.log(error);
		}
	};

	// useEffect(() => {
	// 	if (user?.auth === true) {
	// 		setTimeout(() => {
	// 			window.location.href = "/home";
	// 		}, 1500);
	// 	}
	// }, [setRegister, user]);

	return (
		<div className="register_section">
			<div className="register_inputs">
				<h3>Register</h3>
				<input onChange={handleChange} placeholder="Email address" maxLength={40} type="email" name="email" id="email" value={auth.email} />
				<input onChange={handleChange} placeholder="Username" maxLength={40} type="text" name="username" id="username" value={auth.username} />
				<input onChange={handleChange} placeholder="Password" maxLength={40} type="password" name="password" id="password" value={auth.password} />
				<button onClick={handleClick} className="register_button">
					Register
				</button>
				<NavLink style={{ color: "black", textDecoration: "none", fontSize: "0.9rem" }} onClick={() => setRegister(prevRegister => !prevRegister)}>
					Have already an account ? <span style={{ fontWeight: "400", textDecoration: "underline" }}>Login here</span>
				</NavLink>
			</div>
			<div className="register_social">
				<button className="register_button-social btn-1">
					<FaGoogle style={{ width: "30px", height: "30px", position: "absolute", left: "70", bottom: "10" }} />
					REGISTER WITH GOOGLE
				</button>
				<button className="register_button-social btn-2">
					<FaFacebook style={{ width: "30px", height: "30px", position: "absolute", left: "70", bottom: "10" }} />
					<span style={{ marginLeft: "20px" }}>REGISTER WITH FACEBOOK</span>
				</button>
			</div>
		</div>
	);
};

export default Register;
