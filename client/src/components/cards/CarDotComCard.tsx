import * as React from "react";
import noImgPlaceHolder from "../../assets/noImg.png";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";
import { Dispatch } from "../../redux/store";
import { resetItemDetailsState } from "../../redux/features/carStateSlice";

export interface ICarDotComCardProps {
  item: {
    img: string;
    type: string;
    mileage: string;
    price: string;
    name_modal: string;
    deal: string;
    index: number;
  };
}

export default function CarDotComCard({ item }: ICarDotComCardProps) {
  const navigate = useNavigate();
  const dispatch = Dispatch();

  const checkIfImageExists = (url: string, callback: (exists: boolean) => void) => {
    const img = new Image();
    img.src = url;

    if (img.complete) {
      callback(true);
    } else {
      img.onload = () => {
        callback(true);
      };

      img.onerror = () => {
        callback(false);
      };
    }
  };

  checkIfImageExists(`${item?.img}`, (exists: any) => {
    if (exists) {
      // Success code
      //console.log("good")
      //alert("me")
    } else {
      // Fail code
      console.log("bad");
      //alert("cash")
    }
  });

  return (
    <div
      className={`w-full h-full flex flex-col cursor-pointer   rounded-lg ${item.deal === "Great Deal" ? "border-2 border-emerald-300 " : "border-gray-300 border"}`}
      onClick={() => {
        navigate(`/vehicle/${item.index}`);
        dispatch(resetItemDetailsState());
      }}
    >
      {/* Img */}

      <img
        src={item?.img ? item?.img : noImgPlaceHolder}
        alt="dominant color placeholder"
        loading="lazy"
        className="2xl:h-[270px] xl:h-[220px] lg:h-[193px] sm:h-[180px] min-[445px]:h-[165px] h-[225px] w-auto rounded-t-lg object-cover"
        onError={(e) => {
          e.currentTarget.src = noImgPlaceHolder;
        }}
      />

      {/* Certified */}
      <div className="flex justify-between items-center px-2 py-3">
        <h1 className="text-gray-400 md:text-[12px] text-[10px] font-normal ">FROM CARS.COM</h1>
        {item.deal === "Great Deal" && <button className="bg-emerald-300 px-1   rounded text-[13px]  font-normal ">Great Deal</button>}
      </div>

      {/* Mobile Name */}
      <h1 className=" font-semibold px-2 md:text-base text-[14px] lg:hidden block my-1">{item.name_modal.length >= 25 ? item.name_modal.slice(0, 24) + "..." : item.name_modal}</h1>
      {/* Desktop Name */}
      <h1 className="font-semibold px-2 lg:block hidden">{item.name_modal.length >= 28 ? item.name_modal.slice(0, 28) + "..." : item.name_modal}</h1>

      {/* Mileage */}
      <div className="w-auto h-auto flex items-center text-[13px] mt-2 italic px-2 my-1">
        <NumericFormat value={item.mileage} type="text" suffix=" miles" thousandSeparator={true} />
      </div>

      {/* Price */}
      <h1 className=" font-semibold md:text-[19px] text-[17px] my-3 px-2">
        <NumericFormat value={item.price} prefix={"$"} thousandSeparator={true} />
      </h1>
    </div>
  );
}

// item?.img ? item?.img : noImgPlaceHolder
