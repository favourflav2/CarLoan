import * as React from "react";
import signuppic from "../../../assets/signuppic.jpg";
import useFormHookSignUp, { FormFieldsSignUp } from "./hook/useFromHookSignUp";
import { SubmitHandler } from "react-hook-form";
import ValidationBox from "./ValidationBox";
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { Dispatch, UseSelector } from "../../../redux/store";
import { setError, signUp } from "../../../redux/features/authSlice";
import { toast } from "react-toastify";

export interface ISignUpProps {}

export default function SignUp(props: ISignUpProps) {
  // Redux States
  const {error} = UseSelector(state => state.auth)
  const dispatch = Dispatch();

  const { register, errors, handleSubmit, watch } = useFormHookSignUp();
  const allInputData = watch();

  const errorKeys = Object.keys(errors);

  const navigate = useNavigate();

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
  const [hideVal, setHideVal] = React.useState(true);

  React.useEffect(() => {
    if (errorKeys.length <= 0 || !errorKeys.includes("password")) {
      setHideVal(true);
    } else if (errorKeys.includes("password")) {
      setHideVal(false);
    }
  }, [errorKeys]);

  const onSubmit: SubmitHandler<FormFieldsSignUp> = (data) => {
    dispatch(setError())
    dispatch(signUp({data,navigate}))
  };

  React.useEffect(()=>{
    if(error){
        toast.error(error)
    }
  },[error])

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Content */}
      <div className="w-full h-full flex justify-center items-center sm:px-4 md:mx-0 overflow-y-auto">
        {/* Grid Content */}
        <div className=" xl:w-[65%] lg:w-[75%]  w-full sm:h-full h-screen grid md:grid-cols-2 grid-cols-1 ">
          {/* Left Side */}
          <div className="w-full md:min-h-[500px] h-full sm:min-h-[600px] flex flex-col sm:p-6  px-6 py-4 bg-white sm:rounded-l-2xl shadow-lg">
            <p className="text-[14px]">
              Have an account?{" "}
              <span className=" text-blue-500 cursor-pointer underline" onClick={() => navigate("/auth/login")}>
                Log In
              </span>
            </p>

            <h1 className="font-bold text-[35px] sm:my-10 my-4">Sign Up</h1>

            {/* Form */}
            <form className="w-full flex flex-col" onClick={handleSubmit(onSubmit)}>
              {/* Name & Email */}
              <div className="w-full h-auto grid xl:grid-cols-2 xl:gap-x-6 grid-cols-1 sm:mb-3 mb-2">
                <div className="w-full flex flex-col xl:mb-0 mb-3">
                  <label htmlFor="" className="text-[13px]">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 text-[14px] border rounded-lg p-[10px] bg-gray-100 outline-none"
                    autoComplete="on"
                    {...register("name", {
                      shouldUnregister: true,
                    })}
                  />
                  {errors?.name && <p className="text-red-500 text-[13px] sm:mt-1 ">{errors?.name?.message}</p>}
                </div>
                <div className="w-full flex flex-col">
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
              </div>

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

                <ValidationBox hideVal={hideVal} setHideVal={setHideVal} allInputData={allInputData} />
              </div>

              {/* Confirm Password */}
              <div className="w-full flex flex-col sm:mb-3 mb-2">
                <label htmlFor="" className="text-[13px]">
                  Confirm Password
                </label>
                <input type="password" className="w-full border-gray-300 text-[14px] border rounded-lg p-[10px] bg-gray-100 outline-none" {...register("confirmPassword")} autoComplete="false" />
                {errors?.confirmPassword && <p className="text-red-500 text-[13px] sm:mt-1">{errors?.confirmPassword?.message}</p>}
              </div>

              <button className="p-2 bg-chartGreen/80 rounded-xl text-white shadow-[0px_0px_24px_0.5px_rgb(0_163_108_/_0.8)] my-3">Sign Up</button>
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
