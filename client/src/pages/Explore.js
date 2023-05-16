import React, { useEffect, useState } from "react";
import "./Explore.css";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import axios from "axios";

const Explore = () => {
	const [selectedValue, setSelectedValue] = useState(null);
	const [person, setPerson] = useState(null);
	const navigate = useNavigate();

	const handleClick = e => {
		e.preventDefault();
		navigate(`/profile/${selectedValue.username}`);
	};

	const handleChange = value => {
		setSelectedValue(value);
	};

	const fetchUsers = async () => {
		try {
			const { data } = await axios.get("http://localhost:5000/post/getAllUsers");
			console.log(data);
			setPerson(data.users);
			return data.users;
		} catch (error) {
			console.log(error);
		}
	};
	console.log(person);

	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<div className="explore">
			<div className="explore_main">
				<AsyncSelect
					cacheOptions
					defaultOptions
					value={selectedValue}
					onChange={handleChange}
					getOptionLabel={e => e.username}
					getOptionValue={e => e._id}
					id="explore"
					loadOptions={fetchUsers}
					className="explore_input"
				/>
				<button className="explore_btn" onClick={handleClick}>
					Go
				</button>
			</div>

			<div className="trends">
				<img src="assets/elephant.png" alt="elephant" />
				<img src="assets/giraffe.png" alt="giraffe" />
				<img src="assets/surfing.png" alt="surfing" />
			</div>
		</div>
	);
};

export default Explore;
