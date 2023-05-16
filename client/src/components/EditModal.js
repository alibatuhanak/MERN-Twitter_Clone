import React, { useState, useRef } from "react";
import "./EditModal.css";
import { MdOutlineCancel, MdCameraEnhance } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "../features/auth/authSlice";

const EditModal = ({ edit }) => {
	const [form, setForm] = useState({ name: "", header: "", profile: "" });
	const token = useSelector(state => state.auth.token);
	const { profilePhoto } = useSelector(state => state.auth);
	const { headerPhoto } = useSelector(state => state.auth);

	const dispatch = useDispatch();

	const profileRef = useRef(null);
	const headerRef = useRef(null);

	const handleImages = e => {
		const { name, files } = e.target;
		setForm(prevForm => {
			return {
				...prevForm,
				[name]: files[0],
			};
		});
	};

	const handleChange = e => {
		const { name, value } = e.target;
		setForm(prevForm => {
			return {
				...prevForm,
				[name]: value,
			};
		});
	};

	const handleImagesClick = async () => {
		try {
			const fd = new FormData();
			fd.append("header", form.header);
			fd.append("profile", form.profile);
			fd.append("name", form.name);
			dispatch(changeProfile({ fd, token }));
			profileRef.current.value = "";
			headerRef.current.value = "";
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="edit">
			<div className="edit_main">
				<div className="edit_save">
					<MdOutlineCancel
						onClick={() => {
							edit();
							profileRef.current.value = "";
							headerRef.current.value = "";
						}}
						style={{ cursor: "pointer", color: "white", position: "absolute", width: "25px", height: "25px" }}
					/>
					<h4>Edit Profile</h4>
					<button
						onClick={() => {
							edit();
							handleImagesClick();
						}}
						className="save"
					>
						Save
					</button>
				</div>
				<div className="edit_photos">
					{profilePhoto !== null && profilePhoto !== undefined ? (
						<img className="edit_profile-img" src={`http://localhost:5000/images/profiles/${profilePhoto[0].filename}`} alt="profile" />
					) : (
						<img className="edit_profile-img" src="assets/profile.png" alt="profile" />
					)}
					<label htmlFor="profile">
						<MdCameraEnhance style={{ cursor: "pointer", left: "30px", top: "70px", width: "30px", height: "30px", position: "absolute" }} />
					</label>
					<input ref={profileRef} onChange={handleImages} accept="image/*" type="file" name="profile" id="profile" />

					{headerPhoto !== null && headerPhoto !== undefined ? (
						<img className="edit_header-img" src={`http://localhost:5000/images/headers/${headerPhoto[0].filename}`} alt="header" />
					) : (
						<img className="edit_header-img" src="assets/header_photo.jpg" alt="header" />
					)}

					<label htmlFor="header">
						<MdCameraEnhance
							style={{
								cursor: "pointer",
								left: "0",
								right: "0",
								margin: "auto",
								top: "40px",
								width: "30px",
								height: "30px",
								position: "absolute",
							}}
						/>
					</label>
					<input ref={headerRef} onChange={handleImages} accept="image/*" type="file" name="header" id="header" />
				</div>
				<input onChange={handleChange} placeholder="Name" className="edit_name" type="text" />
			</div>
		</div>
	);
};

export default EditModal;
