import React, { useRef, useState } from "react";
import "./Tweet.css";
import { AiOutlinePicture } from "react-icons/ai";
import { BsEmojiWink } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../features/auth/postSlice";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";

const Tweet = () => {
	const dispatch = useDispatch();

	const token = useSelector(state => state.auth.token);
	const { profilePhoto } = useSelector(state => state.auth);

	const [newPost, setNewPost] = useState({ text: "", img: "" });
	const [emoji, setEmoji] = useState(false);

	const inputRef = useRef(null);

	const handleImage = async e => {
		setNewPost(prevNewPost => {
			return {
				...prevNewPost,
				img: e.target.files[0],
			};
		});
	};

	const handleChange = e => {
		const { name, value } = e.target;
		setNewPost(prevNewPost => {
			return {
				...prevNewPost,
				[name]: value,
			};
		});
	};

	const handleClick = async e => {
		e.preventDefault();
		try {
			if (newPost.text.trim().length !== 0) {
				const fd = new FormData();
				fd.append("file-image", newPost.img);
				fd.append("text", newPost.text);
				dispatch(addPost({ fd, token }));
				setNewPost({ text: "", img: "" });
				inputRef.current.value = "";
			} else {
				toast("Invalid input", {
					position: "top-center",
					autoClose: 2500,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: false,
					draggable: true,
					progress: undefined,
					theme: "dark",
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const emojiClick = (e, emojiObject) => {
		setNewPost(prevNewPost => {
			return {
				...prevNewPost,
				text: prevNewPost.text + emojiObject.emoji,
			};
		});
		setEmoji(false);
	};
	console.log(profilePhoto);
	return (
		<div className="tweet">
			{profilePhoto !== null ? (
				<img className="tweet_profile" src={`http://localhost:5000/images/profiles/${profilePhoto[0].filename}`} alt="profile_picture" />
			) : (
				<img className="tweet_profile" src="assets/profile.png" alt="profile_picture" />
			)}
			<textarea
				onChange={handleChange}
				placeholder="What's happening?"
				className="tweet_text"
				value={newPost.text}
				name="text"
				id="text"
				cols="30"
				rows="5"
				maxLength={130}
			></textarea>

			{typeof newPost.img === "object" && (
				<div className="file_img-section">
					<img className="post_img" src={URL.createObjectURL(newPost.img)} alt="post_img" />
					<MdOutlineCancel
						onClick={() => {
							inputRef.current.value = "";
							setNewPost(prevNewPost => {
								return { ...prevNewPost, img: "" };
							});
						}}
						style={{ cursor: "pointer", color: "black", width: "20px", height: "20px", position: "absolute", top: "10px", right: "10px" }}
					/>
				</div>
			)}
			<div className="tweet_icons">
				<input ref={inputRef} onChange={handleImage} type="file" name="file-image" id="file-image" accept="image/*" />
				<label htmlFor="file-image">
					<AiOutlinePicture style={{ width: "25px", heigth: "25px", position: "absolute", top: "-14", right: "-2" }} />
				</label>

				<BsEmojiWink onClick={() => setEmoji(!emoji)} style={{ cursor: "pointer", width: "20px", heigth: "20px", marginLeft: "5px" }} />
			</div>
			<button onClick={handleClick} className="tweet_btn">
				Tweet
			</button>
			{emoji && (
				<EmojiPicker
					disableSearchBar
					pickerStyle={{ position: "absolute", zIndex: 10, top: "150px" }}
					onEmojiClick={emojiClick}
					searchDisabled
					height={350}
					width="50%"
				/>
			)}
		</div>
	);
};

export default Tweet;
