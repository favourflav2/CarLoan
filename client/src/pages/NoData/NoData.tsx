import * as React from "react";


export interface INoDataProps {}

export default function NoData(props: INoDataProps) {




  return (
    <div className="w-full h-auto  ">
      {/* Desktop Content */}
      <div className="w-full h-auto flex flex-col py-10">
        <div className="w-full flex flex-col justify-center items-center py-10 rounded-xl bg-gray-200 border border-gray-500">
          <h1 className=" font-bold underline dark:text-black">WE DIDN'T FIND ANY EXACT MATCHES</h1>

          {/* <h1 className="mt-8 text-[15px]">Check Out Other Cars</h1> */}
        </div>

        {/* <div className="w-full h-auto grid xl:grid-cols-3  grid-cols-2 gap-3 pt-4 mt-4">
          {loading
            ? Array.from(Array(18).keys()).map((item: any, index: any) => <Skeleton key={index} variant="rectangular" className="w-full h-[300px]" />)
            : relatedCars?.map((item: any, index: any) => (item?.type !== "Cars.com" ? <CarVanaCard item={item} key={index} /> : <CarDotComCard item={item} key={index} />))}
        </div> */}
      </div>
    </div>
  );
}
