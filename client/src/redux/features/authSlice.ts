import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { sign_Up } from "../api/authApi";
import { NavigateFunction } from "react-router-dom";

export interface SignUpObj {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface User {
  token: string;
  userObj: {
    id: string;
    name: string;
    email: string;
    joined: Date | string;
  };
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: any;
}

interface ReduxSignUpWithNavigate {
  data: SignUpObj;
  navigate: NavigateFunction;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: "",
};

export const signUp = createAsyncThunk("signUp", async ({ data, navigate }: ReduxSignUpWithNavigate, { rejectWithValue }) => {
  try {
    const res = await sign_Up(data);
    navigate("/");
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
      localStorage.removeItem("profile");
      state.user = null;
    },
    setError: (state) => {
      state.error = "";
    },
  },
  extraReducers(builder) {
    builder

      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // // Log In
    // .addCase(logIn.pending, (state) => {
    //   state.loading = true;
    // })
    // .addCase(logIn.fulfilled, (state, action) => {
    //   localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
    //   state.loading = false;
    //   state.user = action.payload;
    // })
    // .addCase(logIn.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // })

    // // Change User Name
    // .addCase(changeName.pending, (state) => {
    //   state.loading = true;
    // })
    // .addCase(changeName.fulfilled, (state, action) => {
    //   let { token } = JSON.parse(localStorage.getItem("profile") || "{}");
    //   localStorage.setItem("profile", JSON.stringify({ user: { ...action.payload }, token: token }));
    //   //@ts-ignore
    //   state.user = { user: { ...action.payload }, token: token };
    //   state.loading = false;
    // })
    // .addCase(changeName.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // })

    // // Change Email
    // .addCase(changeEmail.pending, (state) => {
    //   state.loading = true;
    // })
    // .addCase(changeEmail.fulfilled, (state, action) => {
    //   let { token } = JSON.parse(localStorage.getItem("profile") || "{}");
    //   localStorage.setItem("profile", JSON.stringify({ user: { ...action.payload }, token: token }));
    //   //@ts-ignore
    //   state.user = { user: { ...action.payload }, token: token };
    //   state.loading = false;
    // })
    // .addCase(changeEmail.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // });
  },
});

export default authSlice.reducer;
export const { setUser, setLogout, setError } = authSlice.actions;
