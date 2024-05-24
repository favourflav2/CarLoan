import * as React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import modalImg from "../../../assets/firstModal.png";
import darkModalImg from "../../../assets/darkFirstModal.png";
import inputs from "../../../assets/inputsAndChart.png";
import darkInputs from "../../../assets/darkInputAndChart.png";
import summary from "../../../assets/summary.png";
import darkSummary from "../../../assets/darkSummary.png";
import rentVsOwning from "../../../assets/rentVsOwning.png";
import darkRentVsOwning from "../../../assets/darkRentVsOwning.png";
import car from "../../../assets/car.png";
import darkCar from "../../../assets/darkCar.png";
import { UseSelector } from "../../../redux/store";

export interface IPicturesBoxProps {}

export default function PicturesBox(props: IPicturesBoxProps) {
  const { lightAndDarkMode } = UseSelector((state) => state.app);
  return (
    <div className="w-full lg:flex hidden flex-col h-full mb-5 mt-[50px] text-lightText dark:text-darkText">
      {/* Content */}
      <div className="w-full h-full flex flex-col">
        {/* Modal Box/Img */}
        <div className="w-full grid  grid-cols-[40%_60%] gap-x-4  mb-[100px]">
          <Zoom>
            <img src={lightAndDarkMode ? darkModalImg : modalImg} alt="" className="rounded-lg object-cover border border-gray-300 dark:border-gray-500" />
          </Zoom>

          <div className="w-auto h-auto flex flex-col">
            {/* Retirement */}
            <div className="w-full flex flex-col h-auto mb-3">
              <h1 className=" underline font-bold">Retirement</h1>
              <p className=" text-[14px]">
                For the retirement goal you are able to see how much money you will have in the future if you invested a certain amount each month. You will also be able to select your budget in
                retirement and compare what you have to what you will need.
              </p>
            </div>

            {/* House */}
            <div className="w-full flex flex-col h-auto mb-3">
              <h1 className=" underline font-bold">House</h1>
              <p className=" text-[14px]">
                For the house goal you will be able to see how much you will be paying per month during the course of your mortgage. Including property taxes, mortgage insurance etc… Something
                interesting with this is that there is a big section dedicated to showing you more about homeownership.
              </p>
            </div>

            {/* Car */}
            <div className="w-full flex flex-col h-auto mb-3">
              <h1 className=" underline font-bold">Car</h1>
              <p className=" text-[14px]">
                For the house goal you are able to choose your car and an image, when you have your car and everything filled out you will be able to see the monthly payment.
              </p>
            </div>
          </div>
        </div>

        {/* Retirement Box/Img */}
        <div className="w-full grid  grid-cols-[40%_60%]  gap-x-4 mb-[100px]">
          <div className="w-auto h-auto flex flex-col">
            {/* Retirement */}
            <div className="w-full flex flex-col h-auto mb-3">
              <h1 className=" underline font-bold">What's on the page ?</h1>
              <p className=" text-[14px]">
                Every goal is going to have this similar look. With the retirement goal you will see the amount of what you’ll have and the amount of what you will need. Furthermore, with the car and
                house goal you will see the monthly payment and an extra payment.
              </p>
            </div>
          </div>
          <Zoom>
            <img src={lightAndDarkMode ? darkInputs : inputs} alt="" className="rounded-lg object-cover border border-gray-300 dark:border-gray-500" />
          </Zoom>
        </div>

        {/*Summary Box/Img */}
        <div className="w-full grid  grid-cols-2 gap-x-4  mb-[100px]">
          <Zoom>
            <img src={lightAndDarkMode ? darkSummary : summary} alt="Icon" className="rounded-lg object-cover border border-gray-300 dark:border-gray-500" />
          </Zoom>
          <div className="w-auto h-auto flex flex-col ml-5">
            {/*Summary */}
            <div className="w-full flex flex-col h-auto mb-3">
              <h1 className=" underline font-bold">The summary view </h1>
              <p className=" text-[14px]">
                For each goal you will have a graph a view and a summary view. Within the summary view you will able to see more detailed values and an explantion on what is going on.
              </p>
            </div>
          </div>
        </div>

        {/* Cost Of Homeownership Box/Img */}
        <div className="w-full grid  grid-cols-2 2xl:grid-cols-[60%_1fr]  gap-x-4 mb-[100px]">
          <div className="w-auto h-auto flex flex-col ml-5">
            {/* Retirement */}
            <div className="w-full flex flex-col h-auto mb-3">
              <h1 className=" underline font-bold">The real cost of homeownership</h1>
              <p className=" text-[14px]">
                Within the house goal there is a section below the charts that talks about renting vs owning. Give it a read, it simply explains how you can compare your rent to your mortgage and
                figure out if buying/owning a house makes sense.
              </p>
            </div>
          </div>
          <Zoom>
            <img src={lightAndDarkMode ? darkRentVsOwning : rentVsOwning} alt="Icon" className="rounded-lg object-cover border border-gray-300 dark:border-gray-500" />
          </Zoom>
        </div>

        {/* Cars Box/Img */}
        <div className="w-full grid  grid-cols-[40%_60%] gap-x-4   mb-[100px]">
          <Zoom>
            <img src={lightAndDarkMode ? darkCar : car} alt="" className="rounded-lg object-cover border border-gray-300 dark:border-gray-500" />
          </Zoom>
          <div className="w-full flex flex-col h-auto mb-3">
            <h1 className=" underline font-bold">Cars Page</h1>
            <p className=" text-[14px]">
              In the cars page you can search and look up cars from Carvana. You can filter by price, mileage, and even sort them. When you click on a car you will be able to see more information
              about the monthly payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
