import * as React from "react";
import NoSelectedGoalFirstBoxHeader from "./NoSelectedGoal/NoSelectedGoalFirstBoxHeader";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PicturesBox from "./NoSelectedGoal/PicturesBox";
import MobilePictureBox from "./NoSelectedGoal/MobilePictureBox";

export interface INoSelectedGoalProps {}

export default function NoSelectedGoal(props: INoSelectedGoalProps) {
  return (
    <div className="w-full h-full flex flex-col">
      
        {/* Content */}
        <div className="w-full h-auto flex flex-col p-5 2xl:px-[10%]">
            {/* First Box */}
            <NoSelectedGoalFirstBoxHeader />

            <h1 className="w-full flex items-center justify-center font-bold text-[35px] mt-5 text-lightText dark:text-darkText underline ">Guide</h1>
            {/* Desktop View lg break point */}
            <PicturesBox />

            {/* Mobile View */}
            <MobilePictureBox />
        </div>
     
    </div>
  );
}
