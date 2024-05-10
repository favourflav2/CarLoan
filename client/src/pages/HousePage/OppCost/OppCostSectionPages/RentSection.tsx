import * as React from "react";
import { FTVOppCost } from "../../../../components/helperFunctions/oppCostFunctions/oppCostFunction";
import OppCostPieChart from "../../../../components/charts/OppCostPieChart";
import { HouseObjWithFormattedData } from "../../../../redux/features/modalSlices/houseSlice";
import { USDollar } from "../../../CarPage/CarPage";
import { futureValueOfPresentValue } from "../../../../components/helperFunctions/oppCostFunctions/oppCostFunction";
import { getBreakEvenNumber } from "../../components/utils/getBreakEvenNumber";
import { Divider, Tooltip } from "@mui/material";
import { HouseMonthlyPayment } from "../../../../components/helperFunctions/loanfunctions/HouseLoanFuntion";

export interface IRentSectionProps {
  rentOppCost: FTVOppCost;
  selectedGoal: HouseObjWithFormattedData;
  monthlyPayment: HouseMonthlyPayment;
}

export default function RentSection({ rentOppCost, selectedGoal, monthlyPayment }: IRentSectionProps) {
  const [view, setView] = React.useState("Scenario 1");

  //console.log(rentOppCost);

  function returnDataAtPosition(index: number, arr: Array<{ time: number; value: number }>) {
    const fixedIndex = index - 1;

    const newArr = arr[fixedIndex];

    return newArr;
  }

  return (
    <div className="w-full min-h-[600px] rounded-lg shadow-[0px_6px_15px_0px_#00000024] dark:shadow-[0px_6px_15px_0px_#271d17] flex flex-col p-6 bg-inherit ">
      {/* Title */}
      <div className="flex flex-col w-auto h-auto mb-5">
        <h1 className="text-[26px] font-bold">Rent Per Month</h1>
        <h1 className="text-[13px] italic mb-2">* This scenario explains how much money you would have if you invested your rent each month.</h1>
        <h1 className="text-[13px] italic">
          * This situation is not ideal, however if you’re an individual that has the opportunity to live with your parents rent free and or don’t have to pay rent. This scenario can help show you
          what you would have over a period of time.
        </h1>
      </div>

      {/* Chart and Legend */}
      <div className="w-full flex sm:flex-row flex-col items-center justify-center sm:mt-0 mt-4">
        {<OppCostPieChart obj={rentOppCost} />}

        {/* Legend */}
        <div className="w-auto flex flex-col h-auto sm:ml-[20px]  sm:mt-0 mt-6">
          {/* Total Contribution */}
          <div className="w-auto flex items-center justify-between mb-1">
            <div className="w-auto flex items-center">
              <div className="w-[25px] h-[15px] bg-chartGreen rounded-sm" />
              <p className="text-[13px] ml-1">Total Contribution</p>
            </div>

            <p className="xl:ml-[40px]  text-[13px] font-bold italic ml-[38px]">{rentOppCost.totalPrincipal}</p>
          </div>

          {/* Total Interest */}
          <div className="w-auto flex items-center justify-between">
            <div className="w-auto flex items-center">
              <div className="w-[25px] h-[15px] bg-chartYellow rounded-sm" />
              <p className="text-[13px] ml-1">Total Interest Accrued</p>
            </div>

            <p className="xl:ml-[40px]  text-[13px] font-bold italic ml-[38px]">{rentOppCost.totalInterst}</p>
          </div>
        </div>
      </div>

      {/* Desktop Quick Facts */}
      <div className="w-full sm:flex hidden flex-col h-auto mt-8 items-center justify-center">
        {/* Header of Pro/Con */}
        <div className="w-full flex items-center">
          {/* Scenerio 1 */}
          <div className="w-full flex flex-col justify-center items-center">
            <h1 className="sm:text-base text-[15px] font-bold">Scenario 1</h1>
            <p className="text-[13px]">({selectedGoal.term} year mortgage)</p>
          </div>

          {/* Divider */}
          <span className="text-[10px]">vs</span>

          {/* Scenerio 2 */}
          <div className="w-full flex flex-col justify-center items-center">
            <h1 className="sm:text-base text-[15px] font-bold">Scenario 2</h1>
            <p className="text-[13px]">(Investing)</p>
          </div>
        </div>
        <hr className="w-full my-2 border-black dark:border-darkText" />

        <div className="flex w-full h-full items-center">
          {/* #1 */}
          <div className="w-full h-full flex flex-col  ">
            <ul className=" list-inside list-disc">
              <li className="text-[14px] underline mb-1">Mortgage / Principal + Interest</li>
              {selectedGoal.downPayment > 0 && (
                <li className="text-[14px] underline mb-1">
                  <span className="font-bold italic">{USDollar.format(selectedGoal.downPayment)}</span> down payment
                </li>
              )}
              <li className="text-[14px] underline mb-1 dark:text-red-500 text-red-700">
                <span className="font-bold italic">{getBreakEvenNumber(selectedGoal).resultFormatted}/mo</span> portion of payment goes to interest and rest goes to principal
              </li>
              <Tooltip title="The expected home appreciation rate is what is being used to help estimate the future value of your home over the course of your mortgage" placement="top-start">
                <li className="text-[14px] underline mb-1 cursor-pointer">
                  In {selectedGoal.term} years your <span className="font-bold italic">{USDollar.format(selectedGoal.price)}</span> house would be worth{" "}
                  <span className="font-bold italic">{USDollar.format(Number(futureValueOfPresentValue(selectedGoal.price, selectedGoal.appreciation, selectedGoal.term)))}</span>{" "}
                  <span className="text-[17px]">*</span>
                </li>
              </Tooltip>
              <li className="text-[14px] underline mb-1 dark:text-red-500 text-red-700">
                Total interest paid <span className="font-bold italic">{USDollar.format(Number(monthlyPayment.interestSum.toFixed(2)))}</span>
              </li>
            </ul>
          </div>
          <Divider orientation="vertical" flexItem className="  border-black w-auto mx-2" />
          {/* #2 */}
          <div className="w-full h-full flex flex-col  ">
            <ul className=" list-inside list-disc">
              <li className="text-[14px] underline mb-1">Compound Interest / Fund Growth</li>
              {selectedGoal.downPayment > 0 && (
                <li className="text-[14px] underline mb-1">
                  <span className="font-bold italic">{USDollar.format(selectedGoal.downPayment)}</span> initial investment
                </li>
              )}
              <li className="text-[14px] underline mb-1 dark:text-chartGreen text-green-700 ">
                <span className="font-bold italic">{USDollar.format(selectedGoal.rent)}/mo</span> each payment gets invested and receives the benefit of compounding interest
              </li>
              <Tooltip title="The Stock/Bond/Investment Expected Return rate is what is being used to help estimate how much money you would have if you invested in the market." placement="top-start">
                <li className="text-[14px] underline mb-1 cursor-pointer">
                  In {selectedGoal.term} years investing your rent... due to compounding interest you would have accumulated <span className="font-bold italic">{rentOppCost.highestNum}</span>
                  <span className="text-[17px]">*</span>
                </li>
              </Tooltip>
              <li className="text-[14px] underline mb-1 dark:text-chartGreen text-green-700">
                Total interest accrued <span className="font-bold italic">{rentOppCost.totalInterst}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Quick Facts */}
      <div className="w-full h-auto flex sm:hidden flex-col items-center justify-center mt-8 mb-4">
        {/* Header */}
        <div className="w-full justify-around items-center flex">
          {/* Scenrio 1 */}
          <div className="w-auto items-center flex flex-col " onClick={() => setView("Scenario 1")}>
            <h1 className={`text-[15px] cursor-pointer ${view === "Scenario 1" ? "underline font-bold" : "dark:text-gray-600 text-gray-300 dark:font-normal font-bold"}`}>Scenario 1</h1>
            <p className={`text-[12px] cursor-pointer ${view === "Scenario 1" ? "underline font-bold" : "dark:text-gray-600 text-gray-300 dark:font-normal font-bold"}`}>
              ({selectedGoal.term} year mortgage)
            </p>
          </div>
          {/* Scenrio 2 */}
          <div className="w-auto items-center flex flex-col" onClick={() => setView("Scenario 2")}>
            <h1 className={`text-[15px] cursor-pointer ${view === "Scenario 2" ? "underline font-bold" : "dark:text-gray-600 text-gray-300 dark:font-normal font-bold"}`}>Scenario 2</h1>
            <p className={`text-[12px] cursor-pointer ${view === "Scenario 2" ? "underline font-bold" : "dark:text-gray-600 text-gray-300 dark:font-normal font-bold"}`}>(Investing)</p>
          </div>
        </div>

        <hr className="w-full my-2 border-black dark:border-darkText" />

        {view === "Scenario 1" && (
          <div className="w-full h-full flex flex-col  ">
            <ul className=" list-inside list-disc">
              <li className="text-[14px] underline mb-1">Mortgage / Principal + Interest</li>
              {selectedGoal.downPayment > 0 && (
                <li className="text-[14px] underline mb-1">
                  <span className="font-bold italic">{USDollar.format(selectedGoal.downPayment)}</span> down payment
                </li>
              )}
              <li className="text-[14px] underline mb-1 dark:text-red-500 text-red-700">
                <span className="font-bold italic">{getBreakEvenNumber(selectedGoal).resultFormatted}/mo</span> portion of payment goes to interest and rest goes to principal
              </li>
              <Tooltip title="The expected home appreciation rate is what is being used to help estimate the future value of your home over the course of your mortgage" placement="top-start">
                <li className="text-[14px] underline mb-1 cursor-pointer">
                  In {selectedGoal.term} years your <span className="font-bold italic">{USDollar.format(selectedGoal.price)}</span> house would be worth{" "}
                  <span className="font-bold italic">{USDollar.format(Number(futureValueOfPresentValue(selectedGoal.price, selectedGoal.appreciation, selectedGoal.term)))}</span>{" "}
                  <span className="text-[17px]">*</span>
                </li>
              </Tooltip>
              <li className="text-[14px] underline mb-1 dark:text-red-500 text-red-700">
                Total interest paid <span className="font-bold italic">{USDollar.format(Number(monthlyPayment.interestSum.toFixed(2)))}</span>
              </li>
            </ul>
          </div>
        )}

        {view === "Scenario 2" && (
          <div className="w-full h-full flex flex-col  ">
            <ul className=" list-inside list-disc">
              <li className="text-[14px] underline mb-1">Compound Interest / Fund Growth</li>
              {selectedGoal.downPayment > 0 && (
                <li className="text-[14px] underline mb-1">
                  <span className="font-bold italic">{USDollar.format(selectedGoal.downPayment)}</span> initial investment
                </li>
              )}
              <li className="text-[14px] underline mb-1 dark:text-chartGreen text-green-700 ">
                <span className="font-bold italic">{USDollar.format(selectedGoal.rent)}/mo</span> each payment gets invested and receives the benefit of compounding interest
              </li>
              <Tooltip title="The Stock/Bond/Investment Expected Return rate is what is being used to help estimate how much money you would have if you invested in the market." placement="top-start">
                <li className="text-[14px] underline mb-1 cursor-pointer">
                  In {selectedGoal.term} years investing your rent... due to compounding interest you would have accumulated <span className="font-bold italic">{rentOppCost.highestNum}</span>
                  <span className="text-[17px]">*</span>
                </li>
              </Tooltip>
              <li className="text-[14px] underline mb-1 dark:text-chartGreen text-green-700">
                Total interest accrued <span className="font-bold italic">{rentOppCost.totalInterst}</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* About  */}
      <div className="w-full flex flex-col h-auto my-4">
        {/* 5 years */}
        <div className="w-full flex flex-col mb-2">
          <h1 className="sm:text-base text-[15px] font-bold underline mb-[2px]">5 years</h1>
          <p className="sm:text-[15px] text-[14px]">
            Investing your rent each month for just 5 years, and having your investments expected return averaging <span className="font-bold italic">{selectedGoal.opportunityCostRate}%</span> you
            would have accumulated <span className="font-bold italic">{USDollar.format(Number(returnDataAtPosition(5, rentOppCost.data).value.toFixed(2)))}</span>.
          </p>
        </div>

        {/* 10 years */}
        <div className="w-full flex flex-col">
          <h1 className="sm:text-base text-[15px] font-bold underline mb-[2px]">10 years</h1>
          <p className="sm:text-[15px] text-[14px]">
            Investing your rent each month for just 10 years, and having your investments expected return averaging <span className="font-bold italic">{selectedGoal.opportunityCostRate}%</span> you
            would have accumulated <span className="font-bold italic">{USDollar.format(Number(returnDataAtPosition(10, rentOppCost.data).value.toFixed(2)))}</span>.
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col h-auto">
        {/* Investing */}
        <div className="w-full flex flex-col mb-4">
          <h1 className="sm:text-base text-[15px] font-bold underline mb-[2px]">Investing The Rent</h1>
          <p className="text-[13px] text-wrap">
            Like I said earlier this situation is not ideal. However, considering this current economy I think more individuals shouldn’t rush to move out their parents house or any living situation
            where rent is really low. Instead, you should run the numbers. In just 5 years if rates stay consistent and you deciding to invest your money that would’ve went to rent you could have a big nest egg
            saved up that will allow you to do anything.
          </p>
        </div>
      </div>
    </div>
  );
}
