import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Dispatch, UseSelector } from "../../../redux/store";
import { forgotPasswordRedux, setError } from "../../../redux/features/authSlice";
import { toast } from "react-toastify";

export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Please enter an email",
    })
    .email()
    .max(30),
});

type FormFieldsForgetPassword = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const { error, loading } = UseSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = Dispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFieldsForgetPassword>({
    //mode: "all",
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  React.useEffect(() => {
    reset({
      email: "",
    });
  }, []); // eslint-disable-line

  const onSubmit: SubmitHandler<FormFieldsForgetPassword> = (data) => {
    dispatch(setError());
    dispatch(forgotPasswordRedux({ data, navigate }));
  };

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(setError());
    }
  }, [error]); // eslint-disable-line

  //! Debounce button clicks

  return (
    <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-2 sm:p-0">
      {/* Content */}
      <div className="sm:w-[500px] w-full min-h-[200px] rounded-xl shadow-xl bg-white flex flex-col p-5">
        <div className="w-full h-auto flex flex-col">
          <h1 className="font-semibold text-[21px]">Forgot Your Password?</h1>
          <p className="text-[13px] mt-1  text-gray-500">No worries! Just enter your email, and we will assit you</p>
        </div>
        {/* Form */}
        <form className="w-full flex flex-col my-3" onSubmit={handleSubmit(onSubmit)}>
          {/* Name & Email */}
          <div className="w-full flex flex-col sm:mb-3 mb-2">
            <label htmlFor="" className="text-[13px] mb-1">
              Email Address
            </label>
            <input type="email" className="w-full border-gray-300 text-[14px] border rounded-lg p-[10px] bg-gray-100 outline-none" {...register("email", {})} />
            {errors?.email && <p className="text-red-500 text-[13px] sm:mt-1">{errors?.email?.message}</p>}
          </div>

          <button disabled={loading} className={`p-2  rounded-xl  shadow-[0px_0px_24px_0.5px_rgb(255 170 51 / 0.8)] my-3 ${loading ? "bg-gray-300 text-gray-500" : "bg-chartYellow/80 text-white"}`}>
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
