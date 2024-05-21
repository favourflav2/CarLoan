import * as React from "react";
import noImgPlaceHolder from "../../assets/noImg.png";
import { useNavigate } from "react-router-dom";
import { USDollar } from "../../pages/CarPage/CarPage";


// client/src/assets/noImg.png

export interface ICarVanaCardProps {
  item: {
    img: string;
    type: string;
    mileage: number;
    price: number;
    mileage_name: string;
    name_modal: string;
    deal: string;
    index: number;
  };
}

export default function CarVanaCard({ item }: ICarVanaCardProps) {
  const navigate = useNavigate();


  return (
    <div
      className={`w-full h-full flex flex-col cursor-pointer dark:text-darkText text-lightText   rounded-lg ${item.deal === "Great Deal" ? "border-2 border-emerald-300 " : "border-gray-300 border"}`}
      onClick={() => {
        navigate(`/vehicle/${item.index}`);
      }}
    >
      {/* Img */}
      <img
        src={item?.img ? item?.img : noImgPlaceHolder}
        alt="dominant color placeholder"
        loading="lazy"
        className=" w-auto h-[170px] rounded-t-lg object-cover bg-gray-300"
      />

      {/* Certified */}
      <div className="flex justify-between items-center px-2 py-3">
        <h1 className="text-gray-400 md:text-[12px] text-[10px] font-normal ">FROM CARVANA</h1>
        {item.deal === "Great Deal" && <button className="bg-emerald-300 px-1   rounded text-[13px]  font-normal ">Great Deal</button>}
      </div>

      {/* Mobile Name */}
      <h1 className=" font-semibold px-2 md:text-base text-[14px] lg:hidden block my-1">{item.name_modal.length >= 25 ? item.name_modal.slice(0, 24) + "..." : item.name_modal}</h1>
      {/* Desktop Name */}
      <h1 className="font-semibold px-2 lg:block hidden">{item.name_modal.length >= 28 ? item.name_modal.slice(0, 28) + "..." : item.name_modal}</h1>

      {/* Mileage */}
      <div className="w-auto h-auto flex items-center text-[13px] mt-2 italic px-2 my-1">
        <h1 className="">{item.mileage_name}</h1>
        <span className="mx-2">•</span>
          <p>{item.mileage.toLocaleString()} miles</p>  
      </div>

      {/* Price */}
      <h1 className=" font-semibold md:text-[19px] text-[17px] my-3 px-2">
        <p>{USDollar.format(item.price)}</p>
      </h1>
    </div>
  );
}

// 2xl:h-[270px] xl:h-[220px] lg:h-[193px] md:h-[180px] min-[445px]:h-[165px] h-[225px]
