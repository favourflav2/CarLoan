import * as React from "react";
import HowToInvestHeader from "./components/HowToInvestHeader";

export interface IHowToInvestProps {}

export default function HowToInvest(props: IHowToInvestProps) {
  return (
    <div className="w-full min-h-screen flex flex-col dark:text-darkText text-lightText">
      {/* Container */}
      <div className="w-full h-full flex items-center justify-center flex-col">
        {/* Content */}
        <div className="2xl:w-[75%]  xl:w-[80%] lg:w-[90%] w-full  flex flex-col h-full p-4">
          <HowToInvestHeader />
        </div>
      </div>
    </div>
  );
}
