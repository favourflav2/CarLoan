import * as React from "react";
import { Dispatch, UseSelector } from "../../../redux/store";
import { CarVanaDataObj, similarCars } from "../../../redux/features/carSlice";
import CarVanaCard from "../../../components/cards/CarVanaCard";
import { Skeleton } from "@mui/material";

export interface ISimilarCarsProps {
  id: string;
}

export default function SimilarCars({ id }: ISimilarCarsProps) {
  const { similarError, similarLoading, similarCarsData} = UseSelector((state) => state.car);
  const dispatch = Dispatch();

  
React.useEffect(()=>{
    //
},[similarError])

  React.useEffect(() => {
    dispatch(similarCars({ id }));
  }, []); // eslint-disable-line

  return (
    <div className="w-full h-auto flex flex-col my-8 2xl:px-[180px] xl:px-[100px] dark:text-darkText text-lightText">
      {/* Content */}
      <div className="w-full h-full flex flex-col">
        <div className="w-full flex items-center justify-center">
          <h1 className=" md:text-[30px] text-[20px] font-semibold mb-2">RECOMMENDED FOR YOU</h1>
        </div>

        <div className="w-full h-auto grid-cols-1 sm:grid-cols-3 grid  md:grid-cols-4 xl:grid-cols-5  gap-3">
          {similarLoading
            ? Array.from(Array(8).keys()).map((item: any, index: any) => <Skeleton key={index} variant="rectangular" className="w-full h-[200px]" />)
            : similarCarsData?.map((item: CarVanaDataObj) => <CarVanaCard item={item} key={item.index} />)}
        </div>
      </div>
    </div>
  );
}
