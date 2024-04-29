import * as React from "react";

export interface ICompareLoanCardProps {
  value: string | number | undefined;
  title: string;
  compareReg: number;
  compareExtra: number;
  type: "House" | "Car";
}

export default function CompareLoanCard({ value, title, compareReg, compareExtra, type }: ICompareLoanCardProps) {
  const diff = compareReg - compareExtra;
  const addAndDivide = (compareReg + compareExtra) / 2;
  const percentage = Number(((diff / addAndDivide) * 100).toFixed(2));

  return (
    <div className="w-full flex flex-col h-auto">
      {type === "Car" ? (
        <div className="w-full justify-between items-center flex">
          {/* Title Left Side */}
          <h1 className="text-[15px]">{title}</h1>

          {/* Price Container Right Side */}
          {title !== "Term (months)" && (
            <div className={`w-auto flex items-center ${percentage > 0 ? "text-chartGreen " : "text-red-500"}`}>
              {/* Price / Term */}
              <h1 className="text-[15px]  font-semibold">{value}</h1>
            </div>
          )}

          {title === "Term (months)" && (
            <div className={`w-auto flex items-center ${compareExtra < compareReg ? "text-chartGreen " : "text-red-500"}`}>
              {/* Price / Term */}
              <h1 className="text-[15px]  font-semibold">Approx. {Number(value).toFixed(2)} months</h1>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full justify-between items-center flex">
          {/* Title Left Side */}
          <h1 className="text-[15px]">{title}</h1>

          {/* Price Container Right Side */}
          {title !== "Term (years)" && (
            <div className={`w-auto flex items-center ${percentage > 0 ? "text-chartGreen " : "text-red-500"}`}>
              {/* Price / Term */}
              <h1 className="text-[15px]  font-semibold">{value}</h1>
            </div>
          )}

          {title === "Term (years)" && (
            <div className={`w-auto flex items-center ${compareExtra < compareReg ? "text-chartGreen " : "text-red-500"}`}>
              {/* Price / Term */}
              <h1 className="text-[15px]  font-semibold">Approx. {Number(value).toFixed(2)} years</h1>
            </div>
          )}
        </div>
      )}
      <hr className="border border-gray-300 mt-1 mb-2" />
    </div>
  );
}
