import * as React from "react";
import { USDollar } from "../CarPage/CarPage";
import { HouseObjWithFormattedData } from "../../redux/features/modalSlices/houseSlice";
import insertCar from "../../assets/addImg.png";
import EditNoteIcon from "@mui/icons-material/EditNote";

export interface IHouseImgAndNumProps {
  selectedGoal: HouseObjWithFormattedData;
  setOpenImgModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HouseImgAndNum({ selectedGoal, setOpenImgModal }: IHouseImgAndNumProps) {
  const twentyPercentValue = Number(selectedGoal.price * 0.2);
 
  return (
    <div className="w-auto flex flex-col sm:flex-row items-center sm:justify-normal justify-center mb-6 mt-4">
      <div className="w-[220px] h-[220px] flex justify-center items-center  rounded-md relative">
        <img src={selectedGoal.img ? selectedGoal.img : insertCar} alt="" className="w-[200px] h-[200px] rounded-md object-cover" />

        <button className="h-[30px] w-[30px] absolute right-0 top-0  bg-gray-800 dark:bg-gray-200 dark:text-gray-800 text-white   rounded-full" onClick={() => setOpenImgModal(true)}>
          <EditNoteIcon className=" " />
        </button>
      </div>

      {/* About House */}
      <div className="w-auto flex flex-col sm:ml-4  mt-3 sm:mt-0">
        <h1 className="text-[15px]">
          <span className="font-bold text-[15px]">Street Address:</span> {selectedGoal.streetAddress}
        </h1>
        <h1 className="text-[15px]">
          <span className="font-bold text-[15px]">Price:</span> <span className="text-chartYellow font-bold"> {USDollar.format(selectedGoal.price)}</span>
        </h1>
        <h1 className="text-[15px]">
          <span className="font-bold text-[15px]">Down Payment:</span> <span className="text-red-500 font-bold"> {USDollar.format(selectedGoal.downPayment)}</span>
        </h1>

        <h1 className="text-[15px]">
          <span className="font-bold text-[15px]">Term:</span> {selectedGoal.term} years
        </h1>
        <h1 className="text-[15px]">
          <span className="font-bold text-[15px]">Interest Rate:</span> {selectedGoal.interest}%{" "}
        </h1>
        <h1 className="text-[15px]">
          <span className="font-bold text-[15px]">Property Tax:</span> {selectedGoal.propertyTax}%{" "}
        </h1>
        <h1 className="text-[15px]">
          <span className="font-bold text-[15px]">Monthly Insurance:</span> {USDollar.format(selectedGoal.insurance)}
        </h1>
        {selectedGoal.downPayment < twentyPercentValue && (
          <h1 className="text-[15px]">
            <span className="font-bold text-[15px]">Mortgagae Insurance:</span> {selectedGoal.mortgageInsurance}%{" "}
          </h1>
        )}

        <h1 className="text-[15px]">
          <span className="font-bold text-[15px]">Loan Amount:</span> <span className="text-chartGreen font-bold">{USDollar.format(selectedGoal.price - selectedGoal.downPayment)}</span>
        </h1>
      </div>
    </div>
  );
}
