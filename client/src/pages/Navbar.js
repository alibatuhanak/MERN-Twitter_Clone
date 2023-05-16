import React, { useState } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { FaTwitter, FaHome, FaHashtag, FaBookmark } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdSettings, MdOutlineCancel, MdMenu, MdLogout } from "react-icons/md";
import { logOut } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
	const dispatch = useDispatch();

	const [menu, setMenu] = useState(false);

	const closeMenu = close => {
		setMenu(close);
	};

	return (
		<>
			{!menu && (
				<MdMenu
					onClick={() => closeMenu(true)}
					className="twitter_hamburger"
					style={{
						zIndex: 50,
						cursor: "pointer",
						color: "whitesmoke",
						top: "15",
						right: "20",
						width: "32px",
						height: "32px",
					}}
				/>
			)}

			<div className={"navbar_section " + (menu ? "active" : null)}>
				<div className={"navbar " + (menu ? "active" : null)}>
					{menu ? (
						<MdOutlineCancel
							className="twitter_hamburger"
							onClick={() => closeMenu(false)}
							style={{ cursor: "pointer", color: "whitesmoke", position: "absolute", top: "15", right: "20", width: "32px", height: "32px" }}
						/>
					) : null}

					<FaTwitter
						className="twitter"
						style={{
							color: "white",
							marginBottom: " 40px",
							marginLeft: "10px",
							borderRadius: "50px",
							cursor: "pointer",
							overflow: "visible",
						}}
					/>
					<NavLink to="/home" className={({ isActive }) => (isActive ? "navbar_link active" : "navbar_link")} exact="true">
						<div className="icon_div">
							<FaHome
								onClick={() => closeMenu(false)}
								className="navbar_twitter-link"
								style={{ position: "absolute", left: "12px", bottom: "8px", width: "32px", height: "32px" }}
							/>
						</div>
						<h4>Home</h4>
					</NavLink>
					<NavLink to="/explore" className={({ isActive }) => (isActive ? "navbar_link active" : "navbar_link")}>
						<div className="icon_div">
							<FaHashtag
								onClick={() => closeMenu(false)}
								className="navbar_twitter-link"
								style={{ position: "absolute", left: "12px", bottom: "8px", width: "32px", height: "32px" }}
							/>
						</div>
						<h4>Explore</h4>
					</NavLink>
					<NavLink
						onClick={() => closeMenu(false)}
						to="/bookmarks"
						className={({ isActive }) => (isActive ? "navbar_link active" : "navbar_link")}
						style={{ maxWidth: "170px" }}
					>
						<div className="icon_div">
							<FaBookmark
								className="navbar_twitter-link"
								style={{ position: "absolute", left: "12px", bottom: "8px", width: "32px", height: "32px" }}
							/>
						</div>
						<h4>Bookmarks</h4>
					</NavLink>
					<NavLink to="/settings" className={({ isActive }) => (isActive ? "navbar_link active" : "navbar_link")}>
						<div className="icon_div">
							<MdSettings
								onClick={() => closeMenu(false)}
								className="navbar_twitter-link"
								style={{ position: "absolute", left: "12px", bottom: "8px", width: "32px", height: "32px" }}
							/>
						</div>
						<h4>Settings</h4>
					</NavLink>
					<NavLink end to="/profile" className={({ isActive }) => (isActive ? "navbar_link active" : "navbar_link")}>
						<div className="icon_div">
							<CgProfile
								onClick={() => closeMenu(false)}
								className="navbar_twitter-link"
								style={{ position: "absolute", left: "12px", bottom: "8px", width: "32px", height: "32px" }}
							/>
						</div>
						<h4>Profile</h4>
					</NavLink>
					<NavLink
						to="/auth"
						onClick={() => {
							closeMenu(false);
							dispatch(logOut());
							window.location.href = "./auth";
						}}
						className={({ isActive }) => (isActive ? "navbar_link active" : "navbar_link")}
					>
						<div className="icon_div">
							<MdLogout
								className="navbar_twitter-link"
								style={{ position: "absolute", left: "12px", bottom: "8px", width: "32px", height: "32px" }}
							/>
						</div>
						<h4>Logout</h4>
					</NavLink>
				</div>
			</div>
		</>
	);
};

export default Navbar;
