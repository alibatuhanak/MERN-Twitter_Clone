import React, { useState } from "react";
import "./TwitterHome.css";
import Posts from "./Posts";
import Tweet from "./Tweet";
import { useLocation } from "react-router-dom";

const TwitterHome = () => {
	const [color, setColor] = useState(false);
	const { pathname } = useLocation();
	console.log(pathname);

	const changeColor = () => {
		if (window.scrollY >= 90) {
			setColor(true);
		} else {
			setColor(false);
		}
	};

	document.addEventListener("scroll", changeColor);

	return (
		<div className="twitter_section">
			<div className={"twitter_home " + (color ? "transparent" : null)}>
				<h6>{pathname === "/home" ? "Home" : "Bookmarks"}</h6>
			</div>
			<div className="tweetPost">
				{pathname === "/home" ? <Tweet /> : null}
				<Posts />
			</div>
		</div>
	);
};

export default TwitterHome;
