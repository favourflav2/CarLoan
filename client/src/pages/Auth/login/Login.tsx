import * as React from "react";
import signuppic from "../../../assets/signuppic.jpg";
import useFormHookLogin, { FormFieldsLogin } from "./hook/useFormHookLogin";
import { SubmitHandler } from "react-hook-form";
import ValidationBox from "../signup/ValidationBox";
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { Dispatch, UseSelector } from "../../../redux/store";
import { logIn, setError, setSuccessChangePassword } from "../../../redux/features/authSlice";
import { toast } from "react-toastify";
import useShowPasswordReq from "../createNewPassword/hook/useShowPasswordReq";

export default function Login() {
  // Redux States
  const { error, loading, successChangePassword } = UseSelector((state) => state.auth);
  const dispatch = Dispatch();
  const navigate = useNavigate();

  // React hook Form
  const { register, errors, handleSubmit, watch } = useFormHookLogin();
  const allInputData = watch();
  const errorKeys = Object.keys(errors);

  // handleClick show pass
  function handleClickPassword() {
    setShowPass((item) => {
      return {
        ...item,
        password: !item.password,
      };
    });
  }
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // show passwords
  const [showPass, setShowPass] = React.useState({
    password: false,
    confirmPassword: false,
  });

  // Hide validation
  const { hideVal, setHideVal } = useShowPasswordReq({ errorKeys });

  const onSubmit: SubmitHandler<FormFieldsLogin> = (data) => {
    dispatch(setError());
    dispatch(logIn({ data, navigate }));
  };

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(setError());
    }
  }, [error]); // eslint-disable-line

  React.useEffect(() => {
    if (successChangePassword) {
      toast.success(successChangePassword, {
        toastId: "success1",
      });
      dispatch(setSuccessChangePassword());
    }
  }, []); // eslint-disable-line

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Content */}
      <div className="w-full h-full flex justify-center items-center sm:px-4 md:mx-0 overflow-y-auto">
        {/* Grid Content */}
        <div className=" xl:w-[65%] lg:w-[75%]  w-full sm:h-full h-screen grid md:grid-cols-2 grid-cols-1 ">
          {/* Left Side */}
          <div className="w-full md:min-h-[500px] h-full sm:min-h-[600px] flex flex-col sm:p-6  px-6 py-4 bg-white sm:rounded-l-2xl shadow-lg">
            <p className="text-[14px]">
              Dont't have an account?{" "}
              <span className=" text-blue-500 cursor-pointer underline" onClick={() => navigate("/auth/signup")}>
                Sign Up
              </span>
            </p>

            <h1 className="font-bold text-[35px] sm:my-10 my-4">Login</h1>

            {/* Form */}
            <form className="w-full flex flex-col" onClick={handleSubmit(onSubmit)}>
              {/* Name & Email */}

              <div className="w-full flex flex-col sm:mb-3 mb-2">
                <label htmlFor="" className="text-[13px]">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border-gray-300 text-[14px] border rounded-lg p-[10px] bg-gray-100 outline-none"
                  {...register("email", {
                    //shouldUnregister:true
                  })}
                />
                {errors?.email && <p className="text-red-500 text-[13px] sm:mt-1">{errors?.email?.message}</p>}
              </div>

              {/* Password */}
              <div className="w-full flex flex-col relative">
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
                      <IconButton size="small" aria-label="toggle password visibility" onClick={handleClickPassword} onMouseDown={handleMouseDownPassword}>
                        {showPass.password ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  }
                  {...register("password", {
                    //shouldUnregister:true
                  })}
                  autoComplete="false"
                />

                <ValidationBox hideVal={hideVal} setHideVal={setHideVal} password={allInputData.password} />
              </div>

              {/* Forgot Password Link */}
              <p className="w-full items-center justify-end flex sm:text-[13px] text-[12px] mt-1 text-blue-600 sm:mb-2 cursor-pointer hover:underline" onClick={() => navigate("/auth/forgotPassword")}>
                Forgot Password?
              </p>

              <button disabled={loading} className={`p-2 ${loading ? "bg-gray-300" : "bg-chartGreen/80 shadow-[0px_0px_24px_0.5px_rgb(0_163_108_/_0.8)]"} rounded-xl text-white  my-3`}>
                {loading ? "Loading..." : "Sign In"}
              </button>
            </form>
          </div>

          {/* Right Side */}
          <div className="w-full md:min-h-[500px] h-auto sm:min-h-[600px] bg-teal-300 md:flex hidden rounded-r-2xl">
            <img src={signuppic} alt="header" className="object-cover w-full h-full rounded-r-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
