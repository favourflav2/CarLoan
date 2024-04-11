import * as React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export interface ICompareLoanCardProps {
  value:string | number;
  title: string;
  compareReg: number;
  compareExtra: number;
}

export default function CompareLoanCard({ value, title, compareReg, compareExtra }: ICompareLoanCardProps) {
    

    const diff = compareReg - compareExtra
    const addAndDivide = (compareReg + compareExtra) / 2
    const percentage = Number(((diff / addAndDivide) * 100).toFixed(2))

    
  return (
    <div className="w-full flex flex-col h-auto">
      <div className="w-full justify-between items-center flex">
        {/* Title Left Side */}
        <h1 className="text-[15px]">{title}</h1>

        {/* Price Container Right Side */}
        { title !== "New Term (months)" && <div className={`w-auto flex items-center ${percentage > 0 ? 'text-chartGreen ' : 'text-red-500'}`}>

            {/* Percentage */}
          <div className="w-auto h-full flex items-center mr-3">
            {percentage > 0 ?   <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
            <p className="text-[13px] ">{percentage}%</p>
          </div>


            {/* Price / Term */}
          <h1 className="text-[15px]  font-semibold">{value}</h1>

          
        </div>}

        {title === "New Term (months)" && <div className={`w-auto flex items-center ${compareExtra < compareReg ? 'text-chartGreen ' : 'text-red-500'}`}>

            {/* Percentage */}
          <div className="w-auto h-full flex items-center mr-3">
            {compareExtra < compareReg ?   <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
            <p className="text-[13px] ">{(compareReg - compareExtra).toFixed(2)} months faster</p>
          </div>


            {/* Price / Term */}
          <h1 className="text-[15px]  font-semibold">Approx. {Number(value).toFixed(2)} months</h1>

          
        </div>}


      </div>

      <hr className="border border-gray-300 mt-1 mb-2" />
    </div>
  );
}
