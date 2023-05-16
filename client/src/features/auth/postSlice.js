import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
	userPost: [],
	userLikedPost: [],
	userBookmarkedPost: [],
	msg: "",
	loading: false,
	error: false,
};

export const getPosts = createAsyncThunk("post/getPosts", async (body, { rejectWithValue }) => {
	try {
		const { data } = await axios.get("http://localhost:5000/post/getPosts", {
			headers: {
				authorization: `Bearer ${body}`,
			},
		});
		console.log(data);
		return data;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const addPost = createAsyncThunk("post/addPost", async ({ fd, token }, { rejectWithValue }) => {
	try {
		const { data } = await axios.post("http://localhost:5000/post/addPost", fd, {
			headers: {
				authorization: `Bearer ${token}`,
				"Content-Type": "multipart/form-data",
			},
		});

		return data;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const likePost = createAsyncThunk("post/likePost", async (body, { rejectWithValue }) => {
	try {
		const { data } = await axios.patch(`http://localhost:5000/post/likePost/${body.id}`, body, {
			headers: {
				authorization: `Bearer ${body.token}`,
			},
		});
		console.log(data);
		return data;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const getLikedPost = createAsyncThunk("post/getLikedPost", async (body, { rejectWithValue }) => {
	try {
		const { data } = await axios.get("http://localhost:5000/post/getLikedPost", {
			headers: {
				authorization: `Bearer ${body}`,
			},
		});
		return data;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const bookmarkPost = createAsyncThunk("post/bookmarkPost", async (body, { rejectWithValue }) => {
	try {
		const { data } = await axios.patch(`http://localhost:5000/post/bookmarkPost/${body.id}`, body, {
			headers: {
				authorization: `Bearer ${body.token}`,
			},
		});
		return data;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const getBookmarkedPost = createAsyncThunk("post/getBookmarkedPost", async (body, { rejectWithValue }) => {
	try {
		const { data } = await axios.get("http://localhost:5000/post/getBookmarkedPost", {
			headers: {
				authorization: `Bearer ${body}`,
			},
		});
		return data;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const postSlice = createSlice({
	name: "post",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(getPosts.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(getPosts.fulfilled, (state, { payload: { postData, msg } }) => {
				state.userPost = postData;
				state.msg = msg;
				state.loading = false;
				state.error = false;
				// toast(msg, {
				// 	position: "top-center",
				// 	autoClose: 1500,
				// 	hideProgressBar: false,
				// 	closeOnClick: true,
				// 	pauseOnHover: false,
				// 	draggable: true,
				// 	progress: undefined,
				// 	theme: "dark",
				// });
			})
			.addCase(getPosts.rejected, (state, { payload: { msg, postData } }) => {
				state.userPost = [];
				state.msg = msg;
				state.loading = true;
				state.error = true;
				toast(msg, {
					position: "top-center",
					autoClose: 2500,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: false,
					draggable: true,
					progress: undefined,
					theme: "dark",
				});
			});
		builder

			.addCase(addPost.fulfilled, (state, { payload: { postData, msg } }) => {
				state.userPost.push(postData[0]);
				state.msg = msg;
				state.loading = false;
				state.error = false;
			})
			.addCase(addPost.rejected, (state, { payload: { msg } }) => {
				state.userPost = [...state.userPost];
				state.msg = msg;
				state.loading = false;
				state.error = true;
			});
		builder
			.addCase(getLikedPost.pending, state => {
				state.loading = true;
			})
			.addCase(getLikedPost.fulfilled, (state, { payload: { msg, likedPostData } }) => {
				state.userLikedPost = likedPostData;
				state.userPost = [...state.userPost];
				state.loading = false;
				state.error = false;
				state.msg = msg;
				// toast(msg, {
				// 	position: "top-center",
				// 	autoClose: 2500,
				// 	hideProgressBar: false,
				// 	closeOnClick: true,
				// 	pauseOnHover: false,
				// 	draggable: true,
				// 	progress: undefined,
				// 	theme: "dark",
				// });
			})
			.addCase(getLikedPost.rejected, (state, { payload: { msg } }) => {
				state.loading = true;
				state.error = true;
				state.msg = msg;
				state.userLikedPost = [...state.userLikedPost];
				state.userPost = [...state.userPost];
				toast(msg, {
					position: "top-center",
					autoClose: 2500,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: false,
					draggable: true,
					progress: undefined,
					theme: "dark",
				});
			});
		builder
			.addCase(likePost.fulfilled, (state, { payload: { postData, msg, id, likeStatus } }) => {
				const newPost = state.userPost.map(prevUserPost => (prevUserPost._id === id ? { ...prevUserPost, like: postData.like } : { ...prevUserPost }));
				state.userPost = newPost;
				if (likeStatus) {
					state.userLikedPost.push(postData);
				} else {
					const likedPostFilter = state.userLikedPost.filter(x => x._id !== id);
					state.userLikedPost = likedPostFilter;
				}

				state.loading = false;
				state.error = false;
				toast(msg, {
					position: "top-center",
					autoClose: 2500,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: false,
					draggable: true,
					progress: undefined,
					theme: "dark",
				});
			})
			.addCase(likePost.rejected, (state, { payload: { msg } }) => {
				state.userPost = [...state.userPost];
				state.loading = false;
				state.error = true;
				state.msg = msg;
				// toast(msg, {
				// 	position: "top-center",
				// 	autoClose: 2500,
				// 	hideProgressBar: false,
				// 	closeOnClick: true,
				// 	pauseOnHover: false,
				// 	draggable: true,
				// 	progress: undefined,
				// 	theme: "dark",
				// });
			});
		builder
			.addCase(getBookmarkedPost.pending, state => {
				state.loading = true;
			})
			.addCase(getBookmarkedPost.fulfilled, (state, { payload: { msg, bookmarkedPostData } }) => {
				state.userBookmarkedPost = bookmarkedPostData;
				state.loading = false;
				state.error = false;
				state.msg = msg;
			})
			.addCase(getBookmarkedPost.rejected, (state, { payload: { msg } }) => {
				state.userBookmarkedPost = [];
				state.error = true;
				state.loading = false;
				state.msg = msg;
			});
		builder
			.addCase(bookmarkPost.fulfilled, (state, { payload: { msg, id, postData, bookmarkStatus } }) => {
				if (bookmarkStatus) {
					state.userBookmarkedPost.push(postData);
				} else {
					const disbookmark = state.userBookmarkedPost.filter(x => x._id !== id);
					state.userBookmarkedPost = disbookmark;
				}
				state.msg = msg;
				state.loading = false;
				state.error = false;
			})
			.addCase(bookmarkPost.rejected, (state, { payload: { msg } }) => {
				state.loading = false;
				state.error = true;
				state.userBookmarkedPost = [];
				state.msg = msg;
			});
	},
});

export default postSlice.reducer;
