import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { setSelectedGoal } from "../../redux/features/applicationSlice";
import {
  LoanJSType,
  MonthlyPayment,
  getMonthlyPayment,
  loanAmmortization,
  loanAmmortizationWithExtraPayment,
  solveForNumberOfMonths,
  LoanAmmortizationType,
  ExtraNumberMonths,
  MyLoanForLoop,
} from "../../components/helperFunctions/loanfunctions/LoanFunction";
import CarPageInputs from "./CarPageInputs";
import Sticky from "react-sticky-el";
import { ConstructionOutlined } from "@mui/icons-material";
import CarHouseChart from "../../components/charts/CarHouseChart";
import { Divider } from "@mui/material";

export interface ICarPageProps {}

export default function CarPage(props: ICarPageProps) {
  // Redux States
  const { selectedGoal, lightAndDarkMode } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // Chart States
  const [monthlyPayment, setMonthlyPayment] = React.useState<MonthlyPayment>();
  const [regualrLoanAmmortization, setRegualrLoanAmmortization] = React.useState<LoanAmmortizationType>();
  const [extraNumberOfMonths, setExtraNumberOfMonths] = React.useState<ExtraNumberMonths>()
  const [extraLoanAmmortization, setExtraLoanAmmortization] = React.useState<Array<MyLoanForLoop>>()

  // ref to get to top of page on update
  const executeScroll = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: `USD`,
  });

  React.useEffect(() => {
    if (!selectedGoal || selectedGoal.type !== "Car") return;
    setMonthlyPayment(getMonthlyPayment({ rate: selectedGoal.interest, time: selectedGoal.term, downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price }, selectedGoal.extraPayment));
    setExtraNumberOfMonths(solveForNumberOfMonths({rate:selectedGoal.interest,time: selectedGoal.term,downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price}, selectedGoal.extraPayment))
    setRegualrLoanAmmortization(loanAmmortization({ rate: selectedGoal.interest, time: selectedGoal.term, downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price }));
    setExtraLoanAmmortization(loanAmmortizationWithExtraPayment({rate:selectedGoal.interest,time: selectedGoal.term,downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price}, selectedGoal.extraPayment))
    
  }, [selectedGoal]);



  if (!selectedGoal || selectedGoal?.type !== "Car") {
    dispatch(setSelectedGoal(null));
    return null;
  }
  return (
    <div className="w-full h-full flex flex-col p-4 text-lightText dark:text-darkText">
      {/* Content */}
      <div className="w-full flex flex-col h-full ">
        {/* title */}
        <h1 className="text-[19px]  font-bold">
          {selectedGoal.modal} {selectedGoal.name}
        </h1>

        <hr className="border-[1px] border-lightText dark:border-darkText mb-5 mt-1" />

        {/* First Box Img & About Car */}
        <div className={`w-auto flex items-center `}>
          <img src={selectedGoal.img} alt="" />

          {/* About Car */}
          <div className="w-auto flex flex-col ml-4 ">
            <h1 className="text-[15px]">
              <span className="font-bold text-[15px]">Car Name/Modal:</span> {selectedGoal.modal} {selectedGoal.name}
            </h1>
            <h1 className="text-[15px]">
              <span className="font-bold text-[15px]">Price:</span> {USDollar.format(selectedGoal.price)}
            </h1>
            <h1 className="text-[15px]">
              <span className="font-bold text-[15px]">Down Payment:</span> {USDollar.format(selectedGoal.downPayment)}
            </h1>
            <h1 className="text-[15px]">
              <span className="font-bold text-[15px]">Miles:</span> {selectedGoal.mileage.toLocaleString()} miles
            </h1>
            <h1 className="text-[15px]">
              <span className="font-bold text-[15px]">Income:</span> {USDollar.format(selectedGoal.salary)}
            </h1>
            <h1 className="text-[15px]">
              <span className="font-bold text-[15px]">Term:</span> {selectedGoal.term} months
            </h1>
            <h1 className="text-[15px]">
              <span className="font-bold text-[15px]">Interest Rate:</span> {selectedGoal.interest}%{" "}
            </h1>

            <h1 className="text-[15px] mt-3">
              <span className="font-bold text-[15px]">Loan Amount:</span> {USDollar.format(selectedGoal.price - selectedGoal.downPayment)}
            </h1>
          </div>
        </div>

        {/* Chart Content */}
        <div className="w-full h-full flex flex-col mb-5 mt-[60px] justify-center items-center">
          <h1 className="text-[19px] font-semibold">Car Payments</h1>

          {/* Numbers */}
          <div className="w-full flex md:justify-normal justify-around items-center my-5">
            {/* Monthly Payment */}
            <div className="w-full flex justify-center flex-col items-center">
              <h1 className="mb-2 sm:text-[17px] text-[15px] text-lightText dark:text-white font-bold dark:font-normal">Monthly Payment</h1>

              <h1 className="sm:text-[21px] text-[19px] font-semibold text-chartGreen">{monthlyPayment?.monthlyPayment ? USDollar.format(Number(monthlyPayment.monthlyPayment.toFixed(2))) : "-"}</h1>
            </div>

            <Divider orientation="vertical" flexItem className="border border-gray-300 md:mx-8" />

            {/* Extra Payments */}
            <div className="w-full flex justify-center flex-col items-center ">
              <h1 className="mb-2 sm:text-[17px] text-[15px] text-lightText dark:text-white font-bold dark:font-normal">Monthly payment with extra payment</h1>

              <h1 className="sm:text-[21px] text-[19px] font-semibold text-chartYellow">{selectedGoal?.extraPayment === 0 ? "-" : USDollar.format(Number(monthlyPayment?.extraMonthlyPayment.toFixed(2)))}</h1>
            </div>
          </div>

          {/* Total Amount */}
          <div className="w-full flex justify-center items-center my-2">
              <h1>Total Amount Paid: <span className="font-bold">{USDollar.format(Number(monthlyPayment?.totalAmountPaid.toFixed(2)))}</span></h1>
          </div>

          {/* Charts Go Here */}
          <div className="w-full h-auto flex flex-col ">
            <div className="flex items-center w-full justify-center h-auto my-2">
              <h1 className={`mr-8 cursor-pointer ${true  ? "underline text-chartGreen font-bold" : "text-gray-400"}`} >
                Graph View
              </h1>
              <h1 className={` cursor-pointer ${true ? "underline text-chartGreen font-bold" : "text-gray-400"}`} >
                Summary View
              </h1>
            </div>

            <hr className="border my-2 border-gray-300" />
            {regualrLoanAmmortization?.myLoan && extraLoanAmmortization && <CarHouseChart regualarLoan={regualrLoanAmmortization} extraLoan={extraLoanAmmortization}  type="Car" />}
            
          </div>
        </div>
        

        {/* Inputs & Slider */}
        <CarPageInputs executeScroll={executeScroll} />
      </div>
    </div>
  );
}

// sticky top-[74px] z-20 ${lightAndDarkMode ? " bg-homeBg":" bg-lightHomeBg"}

// <>

//       <div className="navbar z-20">
//         {/* title */}
//         <h1 className="text-[19px]  font-bold">
//           {selectedGoal.modal} {selectedGoal.name}
//         </h1>

//         <hr className="border-[1px] border-lightText dark:border-darkText mb-5 mt-1" />
//         {/* First Box Img & About Car */}
//         <div className="w-auto flex items-center sticky top-[100px] z-10">
//           <img src={selectedGoal.img} alt="" />

//           {/* About Car */}
//           <div className="w-auto flex flex-col ml-4 ">
//             <h1 className="text-[15px]">
//               <span className="font-bold text-[15px]">Car Name/Modal:</span> {selectedGoal.modal} {selectedGoal.name}
//             </h1>
//             <h1 className="text-[15px]">
//               <span className="font-bold text-[15px]">Price:</span> {USDollar.format(selectedGoal.price)}
//             </h1>
//             <h1 className="text-[15px]">
//               <span className="font-bold text-[15px]">Down Payment:</span> {USDollar.format(selectedGoal.downPayment)}
//             </h1>
//             <h1 className="text-[15px]">
//               <span className="font-bold text-[15px]">Miles:</span> {selectedGoal.mileage.toLocaleString()} miles
//             </h1>
//             <h1 className="text-[15px]">
//               <span className="font-bold text-[15px]">Income:</span> {USDollar.format(selectedGoal.salary)}
//             </h1>
//             <h1 className="text-[15px]">
//               <span className="font-bold text-[15px]">Term:</span> {selectedGoal.term} months
//             </h1>
//             <h1 className="text-[15px]">
//               <span className="font-bold text-[15px]">Interest Rate:</span> {selectedGoal.interest}%{" "}
//             </h1>

//             <h1 className="text-[15px] mt-3">
//               <span className="font-bold text-[15px]">Loan Amount:</span> {USDollar.format(selectedGoal.price - selectedGoal.downPayment)}
//             </h1>
//           </div>
//         </div>
//       </div>

//       <div className="main mt-[300px]">
//         {/* Content */}
//         <div className="w-full flex flex-col h-full ">

//           {/* Inputs & Slider */}
//           <CarPageInputs />
//         </div>
//       </div>
//     </>
