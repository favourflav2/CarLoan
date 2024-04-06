import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { setSelectedGoal } from "../../redux/features/applicationSlice";
import { LoanJSType, MonthlyPayment, getMonthlyPayment, loanAmmortization, loanAmmortizationWithExtraPayment, solveForNumberOfMonths, LoanAmmortizationType } from "../../components/helperFunctions/loanfunctions/LoanFunction";
import CarPageInputs from "./CarPageInputs";
import Sticky from "react-sticky-el";
import { ConstructionOutlined } from "@mui/icons-material";
import CarHouseChart from "../../components/charts/CarHouseChart";

export interface ICarPageProps {}

export default function CarPage(props: ICarPageProps) {
  // Redux States
  const { selectedGoal, lightAndDarkMode } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // Chart States
  const [monthlyPayment, setMonthlyPayment] = React.useState<MonthlyPayment>()
  const [regualrLoanAmmortization, setRegualrLoanAmmortization] = React.useState<LoanAmmortizationType>()

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
    setMonthlyPayment(getMonthlyPayment({rate:selectedGoal.interest,time: selectedGoal.term,downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price},0))
    
    //solveForNumberOfMonths({rate:selectedGoal.interest,time: selectedGoal.term,downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price}, 500)
    setRegualrLoanAmmortization(loanAmmortization({rate:selectedGoal.interest,time: selectedGoal.term,downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price}))
    //loanAmmortizationWithExtraPayment({rate:selectedGoal.interest,time: selectedGoal.term,downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price}, 2000)
    //solveForNumberOfMonths({rate:selectedGoal.interest,time: selectedGoal.term,downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price}, 2000)
  }, [selectedGoal]);

  //console.log(monthlyPayment,'aklfjalskfklsfjdkl')
  console.log(regualrLoanAmmortization)

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

        {/* Chart */}
        {regualrLoanAmmortization?.myLoan && <CarHouseChart regualarLoan={regualrLoanAmmortization} type="Car" />}

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
