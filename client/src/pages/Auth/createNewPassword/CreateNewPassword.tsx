import * as React from "react";
import { useNavigate } from "react-router-dom";
import useFormHookCreatePassword, { FormFieldsCreatePassword } from "./hook/useFormHookCreatePassword";
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ValidationBox from "../signup/ValidationBox";
import { SubmitHandler } from "react-hook-form";
import { Dispatch, UseSelector } from "../../../redux/store";
import { resetPassword, setError, setResestCheckEmailAndResetPasswordToken } from "../../../redux/features/authSlice";
import { toast } from "react-toastify";
import { isTokenExpired } from "../../../redux/utils/isTokenExpired";
import useShowPasswordReq from "./hook/useShowPasswordReq";

export default function CreateNewPassword() {
  const { loading, error, checkEmailAndResetPasswordToken } = UseSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = Dispatch()

  // React Hook Form
  const { register, watch, errors, handleSubmit } = useFormHookCreatePassword();
  const allInputData = watch();
  const errorKeys = Object.keys(errors);

  // Hide validation
  const {hideVal,setHideVal} = useShowPasswordReq({errorKeys})

  // show passwords
  const [showPass, setShowPass] = React.useState({
    password: false,
    confirmPassword: false,
  });

  // handleClick show pass
  function handleClickPassword(where: "password" | "confirmPassword") {
    setShowPass((item) => {
      return {
        ...item,
        [where]: !item[where],
      };
    });
  }
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit: SubmitHandler<FormFieldsCreatePassword> = (data) => {
    dispatch(setError())
    dispatch(resetPassword({data,navigate}))
  };

  // Making sure that theres a token for req.headers ... if a user presses the back button my local storage get cleared ... so when we come back to reset password page ... if we have the token still we set it as the local storage
  React.useEffect(()=>{
    if(checkEmailAndResetPasswordToken){
        localStorage.setItem("resetToken", JSON.stringify({ token:checkEmailAndResetPasswordToken }));
    }
  },[checkEmailAndResetPasswordToken])
  
   // Jwt Decode
   React.useEffect(() => {
    if (checkEmailAndResetPasswordToken) {
      if (isTokenExpired(checkEmailAndResetPasswordToken)) {
        dispatch(setResestCheckEmailAndResetPasswordToken());
        navigate("/login");
      }
    }
  }, [checkEmailAndResetPasswordToken]); // eslint-disable-line

   // When a user refreshes code they lose the token and are naviagted to login page
   React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      dispatch(setResestCheckEmailAndResetPasswordToken());
      navigate("/login");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []); // eslint-disable-line

  React.useEffect(()=>{
    if(error){
        toast.error(error)
        dispatch(setError())
    }
  },[error]) // eslint-disable-line
  return (
    <div className="w-full min-h-screen bg-gray-200 flex sm:items-center sm:justify-center p-2 sm:p-0">
      {/* Content */}
      <div className="sm:w-[500px] w-full min-h-[200px] rounded-xl shadow-xl bg-white flex flex-col p-5">
        <div className="w-full h-auto flex flex-col mb-2">
          <h1 className="font-semibold text-[21px]">Create New Password</h1>
          <p className="text-[13px] mt-1  text-gray-500">This password should be diffrerent from the previous password </p>
        </div>
        {/* Form */}
        <form className="w-full flex flex-col my-3" onSubmit={handleSubmit(onSubmit)}>
          {/* Password */}
          <div className="w-full flex flex-col sm:mb-3 mb-2 relative">
            <label htmlFor="" className="text-[13px]">
              Password
            </label>

            <OutlinedInput
              sx={{
                "& fieldset": { border: "none" },
              }}
              className="w-full text-[14px] border border-gray-300 rounded-lg h-[43px] bg-gray-100 outline-none "
              type={showPass.password ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton size="small" aria-label="toggle password visibility" onClick={() => handleClickPassword("password")} onMouseDown={handleMouseDownPassword}>
                    {showPass.password ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              }
              {...register("password", {})}
              autoComplete="false"
            />

            <ValidationBox hideVal={hideVal} setHideVal={setHideVal} password={allInputData.password} />
          </div>

          {/* Confirm Password */}
          <div className="w-full flex flex-col sm:mb-3 mb-2">
            <label htmlFor="" className="text-[13px]">
              Confirm Password
            </label>
            <OutlinedInput
              sx={{
                "& fieldset": { border: "none" },
              }}
              className="w-full text-[14px] border border-gray-300 rounded-lg h-[43px] bg-gray-100 outline-none "
              type={showPass.confirmPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton size="small" aria-label="toggle password visibility" onClick={() => handleClickPassword("confirmPassword")} onMouseDown={handleMouseDownPassword}>
                    {showPass.confirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              }
              {...register("confirmPassword")}
              autoComplete="false"
            />
            {errors?.confirmPassword && <p className="text-red-500 text-[13px] sm:mt-1">{errors?.confirmPassword?.message}</p>}
          </div>

          <button disabled={loading} className={`p-2 ${loading ? "bg-gray-300" : "bg-chartGreen/80"} rounded-xl text-white my-3`}>
            {loading ? "Loading..." : "Reset Password"}
          </button>

          <p className="text-[13px] flex items-center justify-center w-full">
            {" "}
            Have an account?{" "}
            <span className=" text-blue-500 cursor-pointer underline" onClick={() => navigate("/auth/login")}>
              Log In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
