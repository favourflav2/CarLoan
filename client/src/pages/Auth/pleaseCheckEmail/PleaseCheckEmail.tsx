import * as React from "react";
import { Dispatch, UseSelector } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { checkOtpValue, setError, setResetPasswordToken } from "../../../redux/features/authSlice";
import { toast } from "react-toastify";
import { isTokenExpired } from "../../../redux/utils/isTokenExpired";

export interface IPleaseCheckEmailProps {}

export default function PleaseCheckEmail(props: IPleaseCheckEmailProps) {
  // Redux States
  const navigate = useNavigate();
  const dispatch = Dispatch();
  const { error, resetPasswordToken, loading } = UseSelector((state) => state.auth);

  // counter state
  const [counter, setCounter] = React.useState(65);

  // Otp text states
  const [otp, setOtp] = React.useState(new Array(4).fill(""));
  const otpBoxReference = React.useRef<any>([]);

  // Handle Chnages for OTP
  function handleChange(value: string, index: number) {
    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < 4 - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  function handleBackspaceAndEnter(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    const value = e.target as HTMLInputElement;
    if (e.key === "Backspace" && !value && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }
    if (e.key === "Enter" && value && index < 4 - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  // Dispatch to backend when we have 4 values ... I added rate limiter
  React.useEffect(() => {
    if (otp.join("").length === 4) dispatch(checkOtpValue({ data: { code: otp.join("") }, navigate }));
  }, [otp]); // eslint-disable-line

  // Handling errors
  React.useEffect(() => {
    if (error) {
      toast.error(error === "Too many requests, please try again later." ? "Too many requests, please try again later." : "Invalid or expired OTP");
      dispatch(setError());
      setOtp(new Array(4).fill(""));
      otpBoxReference.current[0].focus();
    }
  }, [error]); // eslint-disable-line

  // Jwt Decode
  React.useEffect(() => {
    if (resetPasswordToken) {
      if (isTokenExpired(resetPasswordToken)) {
        dispatch(setResetPasswordToken());
        navigate("/login");
      }
    }
  }, [resetPasswordToken, otp]); // eslint-disable-line

  // When a user refreshes code they lose the token and are naviagted to login page
  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      dispatch(setResetPasswordToken());
      navigate("/login");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []); // eslint-disable-line

  React.useEffect(() => {
    const timer = counter > 0 ? setInterval(() => setCounter(counter - 1), 1000) : 0;
    return () => clearInterval(timer);
  }, [counter]);

  if (!resetPasswordToken) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-2 sm:p-0">
      {/* Content */}
      <div className="sm:w-[500px] w-full min-h-[200px] rounded-xl shadow-xl bg-white flex flex-col p-5">
        <div className="w-full h-auto flex flex-col mb-2">
          <h1 className="font-semibold text-[21px]">Please check your email</h1>
          <p className="text-[13px] mt-1  text-gray-500">We've sent you an otp code</p>
        </div>
        {/* Form */}
        <form className="w-full flex flex-col my-3" autoComplete="off">
          {/* Name & Email */}
          <div className="w-full flex flex-col sm:mb-3 mb-2">
            <div className="w-full grid grid-cols-4 gap-4 h-auto">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  value={digit}
                  autoComplete="off"
                  maxLength={1}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                  ref={(reference) => (otpBoxReference.current[index] = reference)}
                  className={`border w-full text-center focus:border-gray-400  h-auto p-3 rounded-md block b focus:border-2 focus:outline-none appearance-none`}
                />
              ))}
            </div>
          </div>

          {counter === 0 ? (
            <p className="text-[13px] mt-1  text-red-500">Your code has expired</p>
          ) : (
            <p className="text-[13px] mt-1  text-gray-500">You have {counter} seconds to enter the code before the code expires</p>
          )}

          <button
            type="button"
            disabled={otp.join("").length !== 4 || loading}
            className={`p-2 ${loading ? 'bg-gray-300':'bg-chartGreen/80'} rounded-xl text-white my-3`}
            onClick={() => {
              if (otp.join("").length === 4) dispatch(checkOtpValue({ data: { code: otp.join("") }, navigate }));
            }}
          >
            {loading ? 'Loading...' : "Verify"}
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
