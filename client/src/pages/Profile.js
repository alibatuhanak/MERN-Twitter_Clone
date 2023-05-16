import React, { useState, useEffect } from "react";
import "./Profile.css";
import EditModal from "../components/EditModal";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import Posts from "../components/Posts";
import { choose } from "../features/auth/authSlice";
import axios from "axios";

const Profile = () => {
	const [editable, setEditable] = useState(false);
	const [person, setPerson] = useState([]);
	const [users, setUsers] = useState([]);

	const navigate = useNavigate();
	const { id } = useParams();
	const { pathname } = useLocation();

	const dispatch = useDispatch();
	const { select } = useSelector(state => state.auth);
	const { username } = useSelector(state => state.auth.user);
	const { profilePhoto } = useSelector(state => state.auth);
	const { headerPhoto } = useSelector(state => state.auth);

	const tweets = useSelector(state => state.post.userPost.filter(item => item.username === username));
	const likes = useSelector(state => state.post.userLikedPost);

	const edit = () => {
		setEditable(!editable);
	};

	const fetchUsernames = async () => {
		try {
			const { data } = await axios.get("http://localhost:5000/post/getAllUsers");
			console.log(data);
			setPerson(data.users);
			return data.users;
		} catch (error) {
			console.log(error);
		}
	};
	const getUsers = async () => {
		try {
			const { data } = await axios.get("http://localhost:5000/post/getUsers");
			setUsers(data.users);
			return data.users;
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchUsernames();
		getUsers();
	}, []);

	const control = person.find(x => x.username === id);
	if (pathname !== "/profile") {
		if (!control) {
			return (
				<div className="profile_page">
					<div
						style={{ padding: "50px", display: "flex", justifyContent: "flex-start", alignItems: "center", flexDirection: "column" }}
						className="profile_section"
					>
						<h1 style={{ textAlign: "center", color: "white" }}>This user does not exist.</h1>
						<Link to="/home">
							<button style={{ backgroundColor: "white", padding: "10px", borderRadius: "20px", border: "none", cursor: "pointer" }}>
								Go Home
							</button>
						</Link>
					</div>
				</div>
			);
		} else {
			const user = users.find(x => x.username === id);
			console.log(user);
			if (user)
				return (
					<div className="profile_page">
						<div className="profile_section">
							<div className="profile_info">
								<div onClick={() => navigate(-1)} className="arrow_section">
									<FaArrowLeft style={{ color: "white", width: "20px", height: "20px" }} />
								</div>

								<h2 className="profile_main-name">{id}</h2>
								<div className="photos_section">
									{user.profile.headerPhoto !== null ? (
										<img
											className="header_photo"
											src={`http://localhost:5000/images/headers/${user.profile.headerPhoto[0].filename}`}
											alt="header_photo"
										/>
									) : (
										<img className="header_photo" src="assets/header_photo.jpg" alt="header_photo" />
									)}

									{user.profile.profilePhoto !== null ? (
										<img
											className="profile_photo"
											src={`http://localhost:5000/images/profiles/${user.profile.profilePhoto[0].filename}`}
											alt="profile_photo"
										/>
									) : (
										<img className="profile_photo" src="assets/profile.png" alt="profile_photo" />
									)}
								</div>

								<div className="names">
									<h2 className="name">{id}</h2>
									<h2 className="name">@{id}</h2>
								</div>
								<div className="choose_section">
									<h4 onClick={() => dispatch(choose("tweets"))} className={"section_1 c1 " + (select === "tweets" && "active")}>
										Tweets
									</h4>
									<h4 onClick={() => dispatch(choose("likes"))} className={"section_1 " + (select === "likes" && "active")}>
										Likes
									</h4>
								</div>
							</div>
							<div className="profile_likes">{<Posts />}</div>
						</div>
					</div>
				);
		}
	}

	return (
		<div className="profile_page">
			<div className="profile_section">
				<div className="profile_info">
					<div onClick={() => navigate(-1)} className="arrow_section">
						<FaArrowLeft style={{ color: "white", width: "20px", height: "20px" }} />
					</div>

					<h2 className="profile_main-name">
						{username}
						<p>{select === "tweets" ? tweets.length + " tweets" : likes.length + " likes"}</p>
					</h2>
					<div className="photos_section">
						{headerPhoto !== null && headerPhoto !== undefined ? (
							<img className="header_photo" src={`http://localhost:5000/images/headers/${headerPhoto[0].filename}`} alt="header_photo" />
						) : (
							<img className="header_photo" src="assets/header_photo.jpg" alt="header_photo" />
						)}

						{profilePhoto !== null && profilePhoto !== undefined ? (
							<img className="profile_photo" src={`http://localhost:5000/images/profiles/${profilePhoto[0].filename}`} alt="profile_photo" />
						) : (
							<img className="profile_photo" src="assets/profile.png" alt="profile_photo" />
						)}
					</div>
					{editable && <EditModal edit={edit} />}
					<button onClick={edit} className="edit_btn">
						Edit Profile
					</button>
					<div className="names">
						<h2 className="name">{username}</h2>
						<h2 className="name">@{username}</h2>
					</div>
					<div className="choose_section">
						<h4 onClick={() => dispatch(choose("tweets"))} className={"section_1 c1 " + (select === "tweets" && "active")}>
							Tweets
						</h4>
						<h4 onClick={() => dispatch(choose("likes"))} className={"section_1 " + (select === "likes" && "active")}>
							Likes
						</h4>
					</div>
				</div>
				<div className="profile_likes">{<Posts />}</div>
			</div>
		</div>
	);
};

export default Profile;
