import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const LoginUser = createAsyncThunk(
  "user/LoginUser",
  async (user, thunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        {
          username: user.username,
          password: user.password,
        },
        { withCredentials: true }
      );
      console.log("Login response:", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.msg;
        console.log("Login error response:", message);
        return thunkAPI.rejectWithValue(message);
      } else {
        console.log("Network error during login");
        return thunkAPI.rejectWithValue("Network error");
      }
    }
  }
);

export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/me`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data.msg;
      return thunkAPI.rejectWithValue(message);
    } else {
      return thunkAPI.rejectWithValue("Network error");
    }
  }
});

export const LogOut = createAsyncThunk("user/LogOut", async () => {
  try {
    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/logout`, {
      withCredentials: true,
    });
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Logout failed:", error);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(LoginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
      state.isError = false;
      state.message = "";
      console.log("Login successful, state:", state);
    });
    builder.addCase(LoginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      console.log("Login failed, state:", state);
    });

    builder.addCase(getMe.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });
    builder.addCase(getMe.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
