// https://reactjsexample.com/mern-stack-social-media-web-application/    ile twitter karışımı birşey yap ana sayfada herkesin postlar gözüksün
// profiline gidince search ten sadece seninki gibi ayarlar güzel navbar yap responsive
// https://www.youtube.com/watch?v=akmJrGe2oEc      REDUX THUNK LOGİN REGİSTER VE REDUX LOCALSTORAGE YAP VİDEODAN

// hover lı navbar yap react router dom active falan ::after falan
// https://reactjsexample.com/a-simple-game-where-you-have-to-guess-all-the-letters-in-a-word/   ve hangman ve tictoctoe yap bundan sonra

import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import BookmarkedPosts from "./pages/BookmarkedPosts";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";

const App = () => {
	function ScrollToTop() {
		const { pathname } = useLocation();

		useEffect(() => {
			window.scrollTo(0, 0);
		}, [pathname]);

		return null;
	}

	const token = useSelector(state => state.auth.token);

	return (
		<>
			{token && <Navbar />}
			<ScrollToTop />
			<Routes>
				<Route path="/auth" element={token ? <Navigate to="/home" /> : <Auth />} />
				<Route path="/home" element={token ? <Home /> : <Navigate to="/auth" />} />
				<Route path="/bookmarks" element={token ? <BookmarkedPosts /> : <Navigate to="/auth" />} />
				<Route path="/profile" element={token ? <Profile /> : <Navigate to="/auth" />}>
					<Route path=":id" element={token ? <Profile /> : <Navigate to="/auth" />} />
				</Route>
				<Route path="/explore" element={token ? <Explore /> : <Navigate to="/auth" />} />
				<Route path="*" element={token ? <Navigate to="/home" /> : <Navigate to="/auth" />} />
				<Route path="/" element={token ? <Navigate to="/home" /> : <Navigate to="/auth" />} />
			</Routes>
			<ToastContainer limit={3} />
		</>
	);
};

export default App;
