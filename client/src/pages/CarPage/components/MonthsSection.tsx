import * as React from "react";
import { UseSelector, Dispatch } from "../../../redux/store";
import { AllMonths } from "../CarPageSummary";
import { CarObjWithFormattedData, setSingleOrGridView } from "../../../redux/features/modalSlices/carModalSlice";
import { MonthlyPayment, getMonthlyPayment } from "../../../components/helperFunctions/loanfunctions/LoanFunction";
import GridViewIcon from "@mui/icons-material/GridView";
import PanoramaIcon from "@mui/icons-material/Panorama";
import TermSlider from "../../../components/TermSlider/TermSlider";
import TermCard from "../../../components/cards/TermCard";
import { LoanObj } from "../../../components/helperFunctions/loanfunctions/LoanFunction";
import { termArr } from "../../../components/multiStepDivs/carDivs/CarComponets/Car1stInputs";


export interface IMonthsSectionProps {
  monthlyPayment: MonthlyPayment
  selectedGoal: CarObjWithFormattedData
}

export default function MonthsSection({ monthlyPayment, selectedGoal }: IMonthsSectionProps) {
  // Redux States
  const { singleOrGridView } = UseSelector((state) => state.carModalSlice);
  const { shrinkDashboardSidebar } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  const [data, setData] = React.useState<Array<AllMonths> | undefined>([]);

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
  return (
    <div className={`w-full flex flex-col h-auto ${shrinkDashboardSidebar ? "2xl:px-[80px]" : "p-4 2xl:px-[80px]"} mb-5 text-lightText dark:text-darkText`}>
      {/* Content */}
      <div className="w-full flex flex-col h-auto">
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
        {singleOrGridView === false && data?.length &&  <TermSlider data={data} monthlyPayment={monthlyPayment} />}

        {/* Grid */}
        {singleOrGridView &&  (
          <div className="grid w-full min-[900px]:grid-cols-2 grid-cols-1 gap-4">
            {data?.map((obj: AllMonths, index: number) => (
              <TermCard key={index} currentInterestSum={monthlyPayment.interestSum} currentMonthlyPayment={monthlyPayment.monthlyPayment} currentTotalAmountPaid={monthlyPayment.totalAmountPaid} obj={obj} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

