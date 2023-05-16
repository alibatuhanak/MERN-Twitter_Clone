import React from "react";
import "./Post.css";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { likePost, bookmarkPost } from "../features/auth/postSlice";

const Post = ({ item, likedPostData, bookmarkedPostData }) => {
	const dispatch = useDispatch();
	const token = useSelector(state => state.auth.token);

	const likeAndDislike = async () => {
		dispatch(likePost({ id: item._id, token }));
	};
	const bookmarkAndDisbookmark = () => {
		dispatch(bookmarkPost({ id: item._id, token }));
	};

	const testForLike = likedPostData.find(x => x._id === item._id);
	const testForBookmark = bookmarkedPostData.find(x => x._id === item._id);
	return (
		<div className="post">
			{item?.profilePhoto !== undefined ? (
				<img
					style={{ pointerEvents: "none", userSelect: "none" }}
					className="post_profile-img"
					src={`http://localhost:5000/images/profiles/${item.profilePhoto[0].filename}`}
					alt="post_profile_picture"
				/>
			) : (
				<img style={{ pointerEvents: "none", userSelect: "none" }} className="post_profile-img" src="assets/profile.png" alt="post_profile_picture" />
			)}
			<div className="post_profile">
				<div className="post_info">
					<h6 className="post_name">{item.username}</h6>
					<h6 className="post_email">@{item.username}</h6>
				</div>
				<div className="post_text">{item.text}</div>
				{item.image !== undefined && <img className="post_image" src={`http://localhost:5000/uploads/${item.image}`} alt="post_img" />}
				<div className="post_likes">
					<div className="like">
						{testForLike === undefined ? (
							<AiOutlineHeart
								onClick={likeAndDislike}
								className={"post_like"}
								style={{ cursor: "pointer", color: "whitesmoke", width: "20px", height: "20px" }}
							/>
						) : (
							<AiFillHeart
								onClick={likeAndDislike}
								className={"post_like" + (testForLike === undefined ? "" : "active")}
								style={{ cursor: "pointer", color: "rgba(244, 46, 142, 0.825)", width: "20px", height: "20px" }}
							/>
						)}
						<h6 className="count">{item.like}</h6>
					</div>

					{testForBookmark === undefined ? (
						<BsBookmark
							onClick={bookmarkAndDisbookmark}
							className="post_bookmark"
							style={{ cursor: "pointer", color: "whitesmoke", width: "20px", height: "20px" }}
						/>
					) : (
						<BsFillBookmarkFill
							onClick={bookmarkAndDisbookmark}
							style={{ cursor: "pointer", color: "rgba(0,0, 190, 255)", width: "20px", height: "20px" }}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Post;
