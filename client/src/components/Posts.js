import React, { useState, useEffect } from "react";
import "./Posts.css";
import Post from "./Post";
import { getBookmarkedPost, getLikedPost, getPosts } from "../features/auth/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

const Posts = () => {
	const [users, setUsers] = useState([]);
	const dispatch = useDispatch();

	const { pathname } = useLocation();
	const { id } = useParams();

	const postData = useSelector(state => state.post);
	const { token } = useSelector(state => state.auth);
	const { username } = useSelector(state => state.auth.user);
	const { select } = useSelector(state => state.auth);

	const getUsers = async () => {
		try {
			const { data } = await axios.get("http://localhost:5000/post/getUsers");
			setUsers(data.users);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (pathname === "/home" || (pathname !== "/profile" && select === "tweets") || (pathname === "/profile" && select === "tweets")) {
			dispatch(getPosts(token));
			dispatch(getLikedPost(token));
			dispatch(getBookmarkedPost(token));
		} else if (pathname === "/bookmarks") {
			dispatch(getBookmarkedPost(token));
		} else if (pathname === "/profile" && select === "likes") {
			dispatch(getLikedPost(token));
		} else if (pathname !== "/profile" && select === "likes") {
			getUsers();
		}
	}, [dispatch, token, pathname, select, id]);

	const tweets = postData.userPost.filter(item => item.username === username);

	const getUser = postData.userPost.filter(item => item.username === id);
	console.log(id);
	console.log(getUser);

	return (
		<div className="posts">
			{postData.loading ? (
				<BeatLoader style={{ position: "absolute", top: "100px" }} color="#ffffff" margin={7} size={23} />
			) : pathname === "/home" ? (
				postData.userPost.map((item, key) => (
					<Post bookmarkedPostData={postData.userBookmarkedPost} likedPostData={postData.userLikedPost} item={item} key={key} />
				))
			) : pathname === "/profile" && select === "tweets" ? (
				tweets.map((item, key) => (
					<Post bookmarkedPostData={postData.userBookmarkedPost} likedPostData={postData.userLikedPost} item={item} key={key} />
				))
			) : pathname === "/profile" && select === "likes" ? (
				postData.userLikedPost.map((item, key) => (
					<Post bookmarkedPostData={postData.userBookmarkedPost} likedPostData={postData.userLikedPost} item={item} key={key} />
				))
			) : pathname !== "/profile" && typeof id !== "undefined" && select === "tweets" ? (
				getUser.map((item, key) => (
					<Post bookmarkedPostData={postData.userBookmarkedPost} likedPostData={postData.userLikedPost} item={item} key={key} />
				))
			) : pathname !== "/profile" && typeof id !== "undefined" && select === "likes" ? (
				users.likedPost.map((item, key) => (
					<Post bookmarkedPostData={postData.userBookmarkedPost} likedPostData={postData.userLikedPost} item={item} key={key} />
				))
			) : (
				postData.userBookmarkedPost.map((item, key) => (
					<Post bookmarkedPostData={postData.userBookmarkedPost} likedPostData={postData.userLikedPost} item={item} key={key} />
				))
			)}
		</div>
	);
};

export default Posts;
