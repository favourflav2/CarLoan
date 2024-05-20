import * as React from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { Dispatch, UseSelector } from "../../redux/store";
import { getOneCar } from "../../redux/features/carSlice";
import { Divider} from "@mui/material";
import { USDollar } from "../CarPage/CarPage";
import {  getMonthlyPayment, loanAmmortization, loanAmmortizationWithExtraPayment, solveForNumberOfMonths } from "../../components/helperFunctions/loanfunctions/LoanFunction";
import { motion, AnimatePresence } from "framer-motion";
import ItemDetailsInputs from "./ItemDetailsInputs";
import ItemDetailsCarBox from "./components/ItemDetailsCarBox";
import useItemDetailsFormHook from "./hooks/useItemDetailsFormHook";
import { ItemDetailsState, setItemDetailsState,  } from "../../redux/features/carStateSlice";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { itemDetailsSchema } from "./itemDetailsSchema";
import ItemDetailsCarChart from "../../components/charts/ItemDetailsCarChart";
import ItemDetailsSummary from "./components/ItemDetailsSummary";

type FormFields = z.infer<typeof itemDetailsSchema>;

export interface IItemDetailsProps {}

export default function ItemDetails(props: IItemDetailsProps) {
  const { id } = useParams();
  const { singleCar, loading, similarCarsData, error } = UseSelector((state) => state.car);
  const { itemDetailsState } = UseSelector((state) => state.page);

  const { errors, control, setValue, watch, handleSubmit } = useItemDetailsFormHook({ singleCar, itemDetailsState });
  const allInputData = watch();



  // Chart State and Summary State
  const [view, setView] = React.useState<string>("Graph View");




   // UseMemo practice
   const monthlyPaymentMemo = React.useMemo(()=>{
    if(itemDetailsState && singleCar){
      return getMonthlyPayment({rate:itemDetailsState.interest,time:itemDetailsState.term, downPayment:itemDetailsState.downPayment, carPrice:singleCar.price}, itemDetailsState.extraPayment)
    }
   
   },[itemDetailsState, singleCar])

   const regualrLoanAmmortizationMemo = React.useMemo(()=>{
    if(itemDetailsState && singleCar){
      return loanAmmortization({rate:itemDetailsState.interest,time:itemDetailsState.term, downPayment:itemDetailsState.downPayment, carPrice:singleCar.price})
    }
   
   },[itemDetailsState, singleCar])

   const extraNumberOfMonthsMemo = React.useMemo(()=>{
    if(itemDetailsState && singleCar){
      return solveForNumberOfMonths({rate:itemDetailsState.interest,time:itemDetailsState.term, downPayment:itemDetailsState.downPayment, carPrice:singleCar.price}, itemDetailsState.extraPayment)
    }
   
   },[itemDetailsState, singleCar])

   const extraLoanAmmortizationMemo = React.useMemo(()=>{
    if(itemDetailsState && singleCar){
      return loanAmmortizationWithExtraPayment({rate:itemDetailsState.interest,time:itemDetailsState.term, downPayment:itemDetailsState.downPayment, carPrice:singleCar.price}, itemDetailsState.extraPayment)
    }
   
   },[itemDetailsState, singleCar])

   

   const dispatch = Dispatch();
   const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const newObj: ItemDetailsState = {
      price: parseFloat(data.price.replace(/[,%$]/gm, "")),
      downPayment: parseFloat(data.downPayment.replace(/[,%$]/gm, "")),
      extraPayment: parseFloat(data.extraPayment.replace(/[,%$]/gm, "")),
      interest: parseFloat(data.interest.replace(/[,%$]/gm, "")),
      term: data.term,
    };
    
    dispatch(setItemDetailsState(newObj))
  };

  // Since react hook form has default values... on the first render of a new car all inputs except car price will be equal to the default value
  //* When I click the submit button my redux state will update ... but if I leave the page and come back... my redux state will be set back to the react hook form default values
  React.useEffect(()=>{
    if(!singleCar) return
      const newObj: ItemDetailsState = {
        price: singleCar.price,
        downPayment: parseFloat(allInputData.downPayment.replace(/[,%$]/gm, "")),
        extraPayment: parseFloat(allInputData.extraPayment.replace(/[,%$]/gm, "")),
        interest: parseFloat(allInputData.interest.replace(/[,%$]/gm, "")),
        term: allInputData.term,
      };

      dispatch(setItemDetailsState(newObj))
    
  },[singleCar])// eslint-disable-line

  



  React.useEffect(() => {
    dispatch(getOneCar({ id }));
  }, [id]); // eslint-disable-line

  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <div className=" justify-center items-center flex w-full h-auto ">error</div>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div className=" w-full min-h-screen grid lg:grid-cols-[280px_1fr] xl:grid-cols-[20%_1fr] 2xl:grid-cols-[17%_1fr] grid-cols-1 lg:px-[50px] sm:px-[30px] sm:gap-y-10  lg:gap-x-10 px-2 ">loading</div>
      ) : (
        singleCar && (
          <div className=" w-full min-h-screen grid lg:grid-cols-[280px_1fr] xl:grid-cols-[20%_1fr] 2xl:grid-cols-[17%_1fr] grid-cols-1 lg:px-[50px] sm:px-[30px] sm:gap-y-10  lg:gap-x-10 px-2 gap-y-2">
            {/* Left Side Inputs */}
            <AnimatePresence mode="wait">
              <motion.div
                key={singleCar ? singleCar.name_modal : "empty"}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full max-h-[900px]"
              >
                <ItemDetailsInputs singleCar={singleCar} errors={errors} control={control} setValue={setValue} allInputData={allInputData} handleSubmit={handleSubmit} onSubmit={onSubmit} />
              </motion.div>
            </AnimatePresence>

            {/* Right Side Chart */}
            <AnimatePresence mode="wait">
              <motion.div
                key={singleCar ? singleCar.name_modal : "empty"}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full flex flex-col dark:text-gray-300 text-black p-4"
              >
                {/* Name and Modal Inputs on Edit */}
                <h1 className="font-bold">{singleCar.name_modal}</h1>

                {/* Car Box */}
                <div className="w-auto flex flex-col sm:flex-row items-center sm:justify-normal justify-center mb-6 mt-4">
                  <div className="max-w-[250px] max-h-[250px] flex justify-center items-center  rounded-md relative">
                    <img src={singleCar.img} alt="" className="w-full h-full rounded-md object-cover" />
                  </div>

                  {/* About Car */}
                 {itemDetailsState && <ItemDetailsCarBox singleCar={singleCar} errors={errors} itemDetailsState={itemDetailsState}/>}
                </div>

                {/* Chart Content */}
                <div className="w-full h-full flex flex-col my-5">
                  <h1 className="text-[19px] font-semibold">Auto Loan </h1>

                  {/* Numbers */}
                  <div className="w-auto flex md:justify-normal justify-around items-center my-5">
                    {/* What You Have Number */}
                    <div>
                      <h1 className="mb-2 sm:text-[17px] text-[15px] text-lightText dark:text-white font-bold dark:font-normal">Monthly Payment</h1>

                      <h1 className="sm:text-[21px] text-[19px] font-semibold text-chartGreen">
                    {monthlyPaymentMemo?.monthlyPayment ? USDollar.format(Number(monthlyPaymentMemo.monthlyPayment.toFixed(2))) : "-"}
                  </h1>
                    </div>

                    <Divider orientation="vertical" flexItem className="border border-gray-300 md:mx-8" />

                    {/* What You Need Number */}
                    <div>
                      <h1 className="mb-2 sm:text-[17px] text-[15px] text-lightText dark:text-white font-bold dark:font-normal">Extra Monthly Payment</h1>

                      <h1 className="sm:text-[21px] text-[19px] font-semibold text-chartYellow">
                    {itemDetailsState?.extraPayment === 0 ? "-" : USDollar.format(Number(monthlyPaymentMemo?.extraMonthlyPayment.toFixed(2)))}
                  </h1>
                    </div>
                  </div>

                  {/* Charts Go Here */}
                  <div className="w-full h-auto flex flex-col ">
                <div className="flex items-center w-auto h-auto">
                  <h1 className={`mr-8 cursor-pointer ${view === "Graph View" ? "underline text-chartGreen font-bold" : "text-gray-400"}`} onClick={() => setView("Graph View")}>
                    Graph View
                  </h1>
                  <h1 className={` cursor-pointer ${view === "Summary View" ? "underline text-chartGreen font-bold" : "text-gray-400"}`} onClick={() => setView("Summary View")}>
                    Summary View
                  </h1>
                </div>

                <hr className="border my-2 border-gray-300" />

                {view === "Graph View" && (
                  <div className="w-full xl:w-[90%] 2xl:w-[70%] h-auto grid grid-cols-1 relative ">
                    {regualrLoanAmmortizationMemo?.myLoan && monthlyPaymentMemo && itemDetailsState && singleCar && (
                      <ItemDetailsCarChart
                        regualarLoan={regualrLoanAmmortizationMemo}
                        extraLoan={extraLoanAmmortizationMemo}
                        monthlyPayment={monthlyPaymentMemo}
                        extraNumberOfMonths={extraNumberOfMonthsMemo}
                        downPayment={itemDetailsState.downPayment}
                      />
                    )}
                  </div>
                )}

                {view === "Summary View" && regualrLoanAmmortizationMemo?.myLoan && itemDetailsState && singleCar && (
                  <div className="w-full xl:w-[90%] 2xl:w-[70%] h-auto grid grid-cols-1 overflow-hidden">
                     {monthlyPaymentMemo &&  <ItemDetailsSummary monthlyPayment={monthlyPaymentMemo} extraNumberOfMonths={extraNumberOfMonthsMemo}/>}
                  </div>
                )}
              </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )
      )}
    </>
  );
}

// <div className="w-full lg:flex hidden flex-col justify-center items-center">
// <h1>Oops! 404</h1>
// <p>We could not find that vehicle</p>
// <p>We are soory for the inconvenience</p>

// <button
//   className="my-4 p-2 h-[60px] bg-red-500 rounded-lg text-white font-bold"
//   onClick={() => {
//     dispatch(setCarSliceError());
//     navigate("/");
//   }}
// >
//   Go Back Home
// </button>
// </div>

// <div className="w-full h-auto flex flex-col mt-10">
//               <h1 className="w-full flex justify-center text-[40px] font-semibold mb-1">Amorization Schedule</h1>

//               <p className="indent-5 mb-2">
//                 Consumer credit reporting company Experian releases average auto loan interest rates in its quarterly Automotive Finance Market report. In the third quarter of 2023, the overall
//                 average auto loan interest rate was 7.03% for new cars and 11.35% for used cars. -{" "}
//                 <span className=" italic text-blue-500 font-medium cursor-pointer">
//                   <Link target="_blank" to="https://www.nerdwallet.com/article/loans/auto-loans/average-car-loan-interest-rates-by-credit-score">
//                     NerdWallet
//                   </Link>
//                 </span>
//               </p>
//               <p className="indent-5">
//                 Since the average interest rate for used cars is 11.35%, we will set the interest rate at that. However, feel free to change it and apply an interest rate to your pleasing.
//               </p>

//             </div>

// <h1 className="w-full flex justify-center text-[25px] mt-8 mb-2">Average car loan interest rates by credit score</h1>
// <CreditTable />

// <div className="w-full flex">
// {/* Img */}
// <img src={singleCar?.img} alt="Car Cover" className="w-[450px] object-cover rounded-2xl" loading="lazy"  />

// {/* Right Side Facts About Car */}
// <div className="w-full flex flex-col ml-4  p-2 rounded-2xl">
//   {/* Name */}
//   <div className="flex items-center mb-1">
//     <h1 className="mr-1 italic">Name:</h1>
//     <h1 className="font-semibold">{singleCar?.name_modal}</h1>
//   </div>

//   {/* Price */}
//   <div className="flex items-center my-1">
//     <h1 className="mr-1 italic">Price:</h1>
//     <h1 className="font-semibold">{singleCar?.price ? USDollar.format(Number(singleCar?.price.toFixed())) : "null"}</h1>
//   </div>

//   {/* mileage */}
//   <div className="flex items-center my-1">
//     <h1 className="mr-1 italic">Mileage:</h1>
//     <h1 className="font-semibold">{singleCar?.mileage ? `${new Intl.NumberFormat().format(Number(singleCar?.mileage))} miles` : "null"}</h1>
//   </div>

//   {/* mileage */}
//   <div className="flex items-center my-1">
//     <h1 className="mr-1 italic">From:</h1>
//     <h1 className="font-semibold">{singleCar?.type}</h1>
//   </div>

//   {/* mileage */}
//   <div className="flex items-center my-1 w-[50%]">
//     <p className="text-[9px] text-gray-500">If theres no image don't worry, some of these cars will be outdated and all it takes is my monthly update and everything will be good</p>
//   </div>
// </div>
// </div>
