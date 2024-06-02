import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { check_Otp_Value, forgot_Password, log_In, reset_Password, sign_Up } from "../api/authApi";
import { NavigateFunction } from "react-router-dom";

export interface SignUpObj {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LogInObj {
  email:string;
  password:string;
}

export interface User {
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
  resetPasswordToken: null | string;
  checkEmailAndResetPasswordToken: null | string;
  successChangePassword:string | null;
}

interface ReduxSignUpWithNavigate {
  data: SignUpObj;
  navigate: NavigateFunction;
}

interface ReduxLogInNavigate {
  data:LogInObj;
  navigate: NavigateFunction;
}

interface ReduxForgotPassword {
  data:{
    email:string
  };
  navigate: NavigateFunction;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: "",
  resetPasswordToken:null,
  checkEmailAndResetPasswordToken:null,
  successChangePassword:null
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

export const logIn = createAsyncThunk("logIn", async ({ data, navigate }: ReduxLogInNavigate, { rejectWithValue }) => {
  try {
    const res = await log_In(data);
    navigate("/");
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

export const forgotPasswordRedux = createAsyncThunk("forgotPasswordRedux", async ({ data, navigate }: ReduxForgotPassword, { rejectWithValue }) => {
  try {
    const res = await forgot_Password(data);
    navigate("/auth/checkEmail");
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

export const checkOtpValue = createAsyncThunk("checkOtpValue", async ({ data, navigate }: {data:{code:string},navigate: NavigateFunction}, { rejectWithValue }) => {
  try {
    const res = await check_Otp_Value(data);
    navigate("/auth/resetPassword");
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

export const resetPassword = createAsyncThunk("resetPassword", async ({ data, navigate }: {data:{password:string,confirmPassword:string},navigate: NavigateFunction}, { rejectWithValue }) => {
  try {
    const res = await reset_Password(data);
    navigate("/auth/login");
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action:PayloadAction<null | User>) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
      localStorage.removeItem("profile");
      state.user = null;
    },
    setError: (state) => {
      state.error = "";
    },
    setResetPasswordToken: (state) => {
      state.resetPasswordToken = null
    },
    setResestCheckEmailAndResetPasswordToken: (state) => {
      localStorage.removeItem("resetToken");
      state.checkEmailAndResetPasswordToken = null
      state.resetPasswordToken = null
    },
    setSuccessChangePassword: (state) => {
      state.successChangePassword = null
    }
    
  },
  extraReducers(builder) {
    builder

      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action:PayloadAction<User>) => {
        localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

    // Log In
    .addCase(logIn.pending, (state) => {
      state.loading = true;
    })
    .addCase(logIn.fulfilled, (state, action:PayloadAction<User>) => {
      localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      state.user = action.payload;
      state.loading = false;
    })
    .addCase(logIn.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    })

    // Forgot Password
    .addCase(forgotPasswordRedux.pending, (state) => {
      state.loading = true;
    })
    .addCase(forgotPasswordRedux.fulfilled, (state, action:PayloadAction<{msg:string,token:string}>) => {
      localStorage.setItem("resetToken", JSON.stringify({ ...action.payload }));
      state.resetPasswordToken = action.payload.token
      state.loading = false;
    })
    .addCase(forgotPasswordRedux.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Check Otp Code
    .addCase(checkOtpValue.pending, (state) => {
      state.loading = true;
    })
    .addCase(checkOtpValue.fulfilled, (state, action:PayloadAction<{msg:string,token:string}>) => {
      localStorage.setItem("resetToken", JSON.stringify({ ...action.payload }));
      state.checkEmailAndResetPasswordToken = action.payload.token
      state.loading = false;
    })
    .addCase(checkOtpValue.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

     // Reset Password
     .addCase(resetPassword.pending, (state) => {
      state.loading = true;
    })
    .addCase(resetPassword.fulfilled, (state, action:PayloadAction<string>) => {
      localStorage.removeItem("resetToken");
      state.checkEmailAndResetPasswordToken = null
      state.successChangePassword = action.payload
      state.loading = false;
    })
    .addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

   
  },
});

export default authSlice.reducer;
export const { setUser, setLogout, setError, setResetPasswordToken, setResestCheckEmailAndResetPasswordToken, setSuccessChangePassword } = authSlice.actions;
