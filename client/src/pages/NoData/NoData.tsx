import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { relatedCarsRedux } from "../../redux/features/carSlice";
import { Skeleton } from "@mui/material";
import CarVanaCard from "../../components/cards/CarVanaCard";
import CarDotComCard from "../../components/cards/CarDotComCard";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface INoDataProps {}

export default function NoData(props: INoDataProps) {
  const dispatch = Dispatch();
  const { relatedCars, loading, error,carVana } = UseSelector((state) => state.car);

  React.useEffect(() => {
    if (!relatedCars?.length && !carVana?.cars?.length) {
      //dispatch(relatedCarsRedux());
      //console.log(relatedCars)
    }
  }, []); // eslint-disable-line

  React.useEffect(()=>{
    if(error){
        toast.error(error)
    }
  },[error])

  return (
    <div className="w-full h-auto  ">
      {/* Desktop Content */}
      <div className="w-full h-auto flex flex-col py-10">
        <div className="w-full flex flex-col justify-center items-center py-10 rounded-xl bg-gray-200 border border-gray-500">
          <h1 className=" font-bold underline">WE DIDNT FIND ANY EXACT MATCHES</h1>

          <h1 className="mt-8 text-[15px]">Check Out Other Cars</h1>
        </div>

        <div className="w-full h-auto grid xl:grid-cols-3  grid-cols-2 gap-3 pt-4 mt-4">
          {loading
            ? Array.from(Array(18).keys()).map((item: any, index: any) => <Skeleton key={index} variant="rectangular" className="w-full h-[300px]" />)
            : relatedCars?.map((item: any, index: any) => (item?.type !== "Cars.com" ? <CarVanaCard item={item} key={index} /> : <CarDotComCard item={item} key={index} />))}
        </div>
      </div>
    </div>
  );
}
