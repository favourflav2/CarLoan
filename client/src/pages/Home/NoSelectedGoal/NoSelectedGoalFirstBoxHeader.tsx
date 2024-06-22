import * as React from "react";
import headerImg from "../../../assets/header.avif";
import { LazyLoadImage } from 'react-lazy-load-image-component';

export interface INoSelectedGoalFirstBoxHeaderProps {}

export default function NoSelectedGoalFirstBoxHeader(props: INoSelectedGoalFirstBoxHeaderProps) {
  return (
    <div className="w-full grid lg:grid-cols-2 grid-cols-1 lg:gap-x-3 lg:gap-y-0 gap-y-4 text-lightText dark:text-darkText">
      {/* Left Side */}
      <div className=" shadow-[0px_6px_15px_0px_#00000024] dark:shadow-[0px_6px_15px_0px_#271d17] h-auto flex flex-col justify-between rounded-lg p-4">
        {/* Title */}
        <div className="w-full h-auto flex flex-col">
          <p className="text-chartGreen text-[15px] font-semibold">About This App</p>

          <h1 className=" sm:text-[27px] text-[20px] font-bold mt-6">Our Goal Is To Show The Power of Compounding Interest And Time </h1>
        </div>

        {/* About Text */}
        <p className="sm:text-[13.5px] text-[12.5px] lg:mt-0 mt-4">
          I created this app in accordance to my personal interest in numbers and finance. Also, watching a YouTuber named Caleb Hammer also giving me inspiration of coming up with this app. This apps
          sole purpose is to show the relationship between compounding interest and time. Wether it’s with a car loan, mortgage, or an investment. Being able to visually see how a loan may cost you
          over time can help an individual really understand what they’re doing. So please look around, check out the house section and the paragraphs about the real cost of homeownership! :)
        </p>
      </div>

      {/* Right Side */}
      <div className="shadow-[0px_6px_15px_0px_#00000024] dark:shadow-[0px_6px_15px_0px_#271d17] h-auto rounded-lg flex flex-col">
        {/* <img src={headerImg} alt="headerImg" className="w-full h-[280px] object-cover rounded-lg" loading="lazy"/> */}
        <LazyLoadImage src={headerImg} alt="headerImg" className="w-full h-[280px] object-cover rounded-lg" effect="blur"/>

        <div className="w-full h-auto flex flex-col p-3">
          <h1 className="w-full flex items-center justify-center mt-3 font-bold text-[20px]">Average American Debt in 2024</h1>
          <p className="w-full flex items-center justify-center mb-4 font-bold text-[14px]">Total Balance (2023, Q4)</p>

          <div className="grid-cols-3 w-full grid gap-3 ">
            <div className="w-auto h-auto flex flex-col rounded-xl bg-gray-200 dark:bg-[RGBA(0,163,108,0.2)] p-3">
              <p className="font-bold text-[15px]">$1.61 Trillion</p>
              <p className="text-[13px]">Auto Loan</p>
            </div>

            <div className="w-auto h-auto flex flex-col rounded-xl bg-gray-200 dark:bg-[RGBA(0,163,108,0.2)] p-3">
              <p className="font-bold text-[15px]">$1.6 Trillion</p>
              <p className="text-[13px]">Student Loan Debt</p>
            </div>
            <div className="w-auto h-auto flex flex-col rounded-xl bg-gray-200 dark:bg-[RGBA(0,163,108,0.2)] p-3">
              <p className="font-bold text-[15px]">$1.13 Trillion</p>
              <p className="text-[13px]">Credit Card Debt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
