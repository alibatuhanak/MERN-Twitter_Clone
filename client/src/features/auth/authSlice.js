import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const user = localStorage.getItem("auth") !== null ? JSON.parse(localStorage.getItem("auth")) : null;
const token = localStorage.getItem("token") !== null ? JSON.parse(localStorage.getItem("token")) : null;
const profilePhoto = localStorage.getItem("profilePhoto") !== "undefined" ? JSON.parse(localStorage.getItem("profilePhoto")) : undefined;
const headerPhoto = localStorage.getItem("headerPhoto") !== "undefined" ? JSON.parse(localStorage.getItem("headerPhoto")) : undefined;
const auth = localStorage.getItem("token") !== null ? true : false;

const initialState = {
	user,
	token,
	profilePhoto,
	headerPhoto,
	msg: "",
	loading: false,
	auth,
	select: "tweets",
};
export const loginUser = createAsyncThunk("auth/loginUser", async (body, { rejectWithValue }) => {
	try {
		const { data } = await axios.post("http://localhost:5000/auth/login", body);
		return data;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const registerUser = createAsyncThunk("auth/registerUser", async (body, { rejectWithValue }) => {
	try {
		const { data } = await axios.post("http://localhost:5000/auth/register", body);
		return data;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const likePost = createAsyncThunk("auth/likePost", async (body, { rejectWithValue }) => {
	try {
		const { data } = await axios.post(`http://localhost:5000/post/likePost/${body.id}`, body, {
			headers: {
				authorization: `Bearer ${body.token}`,
			},
		});
		return data;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const changeProfile = createAsyncThunk("post/changePhotos", async (body, { rejectWithValue }) => {
	try {
		const { data } = await axios.patch("http://localhost:5000/post/changeProfile", body.fd, {
			headers: {
				authorization: `Bearer ${body.token}`,
			},
		});

		return data;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		choose: (state, action) => {
			state.select = action.payload;
		},
		logOut: state => {
			localStorage.clear();
			state.msg = "";
			state.loading = false;
			state.auth = false;
		},
	},
	extraReducers: builder => {
		builder.addCase(loginUser.pending, state => {
			state.loading = true;
		});
		builder.addCase(loginUser.fulfilled, (state, { payload: { user, msg, auth, AccessToken } }) => {
			state.user = { username: user.username, email: user.email };
			state.loading = false;
			state.token = AccessToken;
			state.msg = msg;
			state.auth = auth;
			state.profilePhoto = user.profile.profilePhoto;
			state.headerPhoto = user.profile.headerPhoto;

			localStorage.setItem("auth", JSON.stringify(state.user));
			localStorage.setItem("token", JSON.stringify(AccessToken));
			localStorage.setItem("profilePhoto", JSON.stringify(user.profile.profilePhoto));
			localStorage.setItem("headerPhoto", JSON.stringify(user.profile.headerPhoto));

			toast(state?.msg, {
				position: "top-center",
				autoClose: 1500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		});
		builder.addCase(loginUser.rejected, (state, { payload: { msg } }) => {
			state.loading = false;
			state.user = null;
			state.msg = msg;
			state.auth = false;

			toast(state?.msg, {
				position: "top-center",
				autoClose: 1500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		});
		builder.addCase(registerUser.pending, state => {
			state.loading = true;
		});
		builder.addCase(registerUser.fulfilled, (state, { payload: { msg, newUser, auth, AccessToken } }) => {
			state.loading = false;
			state.user = { username: newUser.username, email: newUser.email };
			state.token = AccessToken;
			state.auth = auth;
			state.msg = msg;

			localStorage.setItem("auth", JSON.stringify(state.user));
			localStorage.setItem("token", JSON.stringify(AccessToken));

			toast(msg, {
				position: "top-center",
				autoClose: 1500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		});
		builder.addCase(registerUser.rejected, (state, { payload: { msg } }) => {
			state.loading = false;
			state.user = null;
			state.msg = msg;
			state.auth = false;

			toast(msg, {
				position: "top-center",
				autoClose: 1500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		});
		builder
			.addCase(changeProfile.pending, state => {
				state.loading = true;
			})
			.addCase(changeProfile.fulfilled, (state, { payload: { msg, changeProfile, info } }) => {
				state.loading = false;
				state.msg = msg;
				state.headerPhoto = info.headerPhoto;
				state.profilePhoto = info.profilePhoto;
				localStorage.setItem("headerPhoto", JSON.stringify(info.headerPhoto));
				localStorage.setItem("profilePhoto", JSON.stringify(info.profilePhoto));
			})
			.addCase(changeProfile.rejected, (state, { payload: { msg } }) => {
				state.loading = false;
				state.msg = msg;
			});
	},
});

export const { logOut, choose } = authSlice.actions;
export default authSlice.reducer;

// [loginUser.pending]: (state, action) => {
//     state.loading = true;
// },
// [loginUser.fulfilled]: (state, { payload: { error, msg } }) => {
//     state.loading = false;
//     if (error) {
//         state.error = error;
//     }
// },
// [loginUser.rejected]: (state, action) => {
//     state.loading = false;
// },
