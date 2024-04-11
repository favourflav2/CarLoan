import * as React from "react";
import { termArr } from "../../components/multiStepDivs/carDivs/CarComponets/Car1stInputs";
import { CarObjWithFormattedData, setSingleOrGridView } from "../../redux/features/modalSlices/carModalSlice";
import { ExtraNumberMonths, LoanObj, getMonthlyPayment } from "../../components/helperFunctions/loanfunctions/LoanFunction";
import { MonthlyPayment } from "../../components/helperFunctions/loanfunctions/LoanFunction";
import { USDollar } from "./CarPage";
import MonthlyPaymentBox from "./components/MonthlyPaymentBox";
import ExtraMonthlyBox from "./components/ExtraMonthlyBox";
import GridViewIcon from "@mui/icons-material/GridView";
import PanoramaIcon from "@mui/icons-material/Panorama";
import { UseSelector, Dispatch } from "../../redux/store";
import TermSlider from "../../components/TermSlider/TermSlider";
import TermCard from "../../components/cards/TermCard";

export interface ICarPageSummaryProps {
  selectedGoal: CarObjWithFormattedData;
  monthlyPayment: MonthlyPayment | undefined;
  extraNumberOfMonths: ExtraNumberMonths | undefined;
}

export interface AllMonths extends MonthlyPayment {
  term: number;
}

export default function CarPageSummary({ selectedGoal, monthlyPayment, extraNumberOfMonths }: ICarPageSummaryProps) {
  // Redux States
  const { singleOrGridView } = UseSelector((state) => state.carModalSlice);
  const dispatch = Dispatch();

  const [data, setData] = React.useState<Array<AllMonths> | undefined>([]);

  // values obj destructure
  const numberOfMonths = extraNumberOfMonths?.numberOfMonths ? extraNumberOfMonths.numberOfMonthsNoRounding : 0;
  const extraMonthlyPayment = monthlyPayment?.extraMonthlyPayment ? monthlyPayment?.extraMonthlyPayment : 0;

  React.useEffect(() => {
    if (!selectedGoal || selectedGoal?.type !== "Car") return;
    function getMonthlyPaymentForAllMonths(obj: LoanObj, selectGoal: CarObjWithFormattedData) {
      const arr = termArr.filter((value) => value !== obj.time);
      const res = [];

      for (let i = 0; i <= arr.length; i++) {
        if (arr[i] !== undefined) {
          const monthlyPaymentObj = getMonthlyPayment({ rate: selectGoal.interest, time: arr[i], downPayment: selectGoal.downPayment, carPrice: selectGoal.price }, selectGoal.extraPayment);

          if (!monthlyPaymentObj) return;

          const newObj = {
            ...monthlyPaymentObj,
            term: arr[i],
          };
          res.push(newObj);
        }
      }

      return res;
    }

    setData(getMonthlyPaymentForAllMonths({ rate: selectedGoal.interest, time: selectedGoal.term, downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price }, selectedGoal));
  }, [selectedGoal]);

  function getExtraPaymentTotalPaid(months: number, monthlyP: number, downPayment: number, carPrice: number) {
    if (!months || !monthlyP! || !downPayment === undefined || !carPrice) return { nonFormattedValue: 0, formattedValue: "", interestNonFormattedValue: "", interestFormattedValue: 0 };

    const value = months * monthlyP + downPayment;
    const value2 = Number(Math.abs(value - carPrice));

    return {
      nonFormattedValue: value,
      formattedValue: USDollar.format(Number(value.toFixed(2))),
      interestNonFormattedValue: value2,
      interestFormattedValue: USDollar.format(Number(value2.toFixed(2))),
    };
  }

  if (!monthlyPayment || !extraNumberOfMonths) return null;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Content */}
      <div className="w-full h-full flex flex-col">
        <h1 className="my-3 font-semibold">Your Loan Estimate</h1>

        {/* 1st Box */}
        <MonthlyPaymentBox header="Monthly Payment" selectedGoal={selectedGoal} monthlyPayment={monthlyPayment} />

        {selectedGoal.extraPayment > 0 && (
          <div className="w-full h-auto items-center justify-center flex my-10">
            <h1 className="text-[24px]">VS</h1>
          </div>
        )}

        {/* 2nd Box Extra Monthly Payment */}
        <ExtraMonthlyBox
          header="Extra Monthly Payment"
          selectedGoal={selectedGoal}
          extraMonthlyPayment={extraMonthlyPayment}
          numberOfMonths={numberOfMonths}
          monthlyPayment={monthlyPayment}
          getExtraPaymentTotalPaid={getExtraPaymentTotalPaid}
        />

        {/* Grid View Or Single View */}
        <div className="mt-10 mb-5 w-auto h-auto">
          {singleOrGridView ? (
            <div className="w-auto flex items-center cursor-pointer" onClick={() => dispatch(setSingleOrGridView())}>
              <PanoramaIcon className="text-[20px]" />
              <h1 className="text-[15px] ml-1">Show Single</h1>
            </div>
          ) : (
            <div className="w-auto flex items-center cursor-pointer" onClick={() => dispatch(setSingleOrGridView())}>
              <GridViewIcon className="text-[20px]" />
              <h1 className="text-[15px] ml-1">Show Grid</h1>
            </div>
          )}
        </div>

        {/* Slider */}
        {singleOrGridView === false && data?.length && <TermSlider data={data} monthlyPayment={monthlyPayment} />}

        {/* Grid */}
        {singleOrGridView && monthlyPayment && <div className="grid w-full min-[900px]:grid-cols-2 grid-cols-1 gap-4">
            {data?.map((obj:AllMonths,index:number)=>(
                <TermCard currentInterestSum={monthlyPayment.interestSum} currentMonthlyPayment={monthlyPayment.monthlyPayment} currentTotalAmountPaid={monthlyPayment.totalAmountPaid} obj={obj}/>
            ))}
        </div>}
      </div>
    </div>
  );
}
