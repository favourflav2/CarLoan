import * as React from "react";
import { FTVOppCost } from "../../../../components/helperFunctions/oppCostFunctions/oppCostFunction";
import OppCostPieChart from "../../../../components/charts/OppCostPieChart";
import { HouseObjWithFormattedData } from "../../../../redux/features/modalSlices/houseSlice";
import { USDollar } from "../../../CarPage/CarPage";
import { futureValueOfPresentValue, oppCostFVWithBreakEvenAsPayment } from "../../../../components/helperFunctions/oppCostFunctions/oppCostFunction";
import { getBreakEvenNumber } from "../../components/utils/getBreakEvenNumber";
import { Divider, Tooltip } from "@mui/material";
import { HouseMonthlyPayment } from "../../../../components/helperFunctions/loanfunctions/HouseLoanFuntion";

export interface IDiffSectionProps {
  diffOppCost: FTVOppCost;
  selectedGoal: HouseObjWithFormattedData;
  monthlyPayment: HouseMonthlyPayment;
}

export default function DiffSection({ diffOppCost, selectedGoal, monthlyPayment }: IDiffSectionProps) {
    const {rent} = selectedGoal
  const breakEvenPerMonth = getBreakEvenNumber(selectedGoal).resultNoFormat;

  const diff = Math.abs(breakEvenPerMonth - rent)

  console.log(diff)
  

  const [view, setView] = React.useState("Scenario 1");
  return (
    <div className="w-full min-h-[600px] rounded-lg shadow-[0px_6px_15px_0px_#00000024] dark:shadow-[0px_6px_15px_0px_#271d17] flex flex-col p-6 bg-inherit ">
      {/* Title */}
      <div className="flex flex-col w-auto h-auto mb-5">
        <h1 className="text-[26px] font-bold">Break Even - Rent</h1>
        <h1 className="text-[13px] italic mb-2">
          * This scenario I believe is the most beneficial, because a lot of people believe that rent is just throwing away money.
        </h1>
        <h1 className="text-[13px] italic">
          * Since mortgage rates are rising the total cost of homeownership will rise also, that there brings on this scenario. What if you took the difference between the cost of homeownership and rent and decided to invest it?
        </h1>
      </div>

      {/* Chart and Legend */}
      <div className="w-full flex sm:flex-row flex-col items-center justify-center sm:mt-0 mt-4">
        {<OppCostPieChart obj={diffOppCost} />}

        {/* Legend */}
        <div className="w-auto flex flex-col h-auto sm:ml-[20px]  sm:mt-0 mt-6">
          {/* Total Contribution */}
          <div className="w-auto flex items-center justify-between mb-1">
            <div className="w-auto flex items-center">
              <div className="w-[25px] h-[15px] bg-chartGreen rounded-sm" />
              <p className="text-[13px] ml-1">Total Contribution</p>
            </div>

            <p className="xl:ml-[40px]  text-[13px] font-bold italic ml-[38px]">{diffOppCost.totalPrincipal}</p>
          </div>

          {/* Total Interest */}
          <div className="w-auto flex items-center justify-between">
            <div className="w-auto flex items-center">
              <div className="w-[25px] h-[15px] bg-chartYellow rounded-sm" />
              <p className="text-[13px] ml-1">Total Interest Accrued</p>
            </div>

            <p className="xl:ml-[40px]  text-[13px] font-bold italic ml-[38px]">{diffOppCost.totalInterst}</p>
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
                <span className="font-bold italic">{USDollar.format(Number((diff).toFixed(2)))}/mo</span> each payment gets invested and receives the benefit of compounding interest
              </li>
              <Tooltip title="The Stock/Bond/Investment Expected Return rate is what is being used to help estimate how much money you would have if you invested in the market." placement="top-start">
                <li className="text-[14px] underline mb-1 cursor-pointer">
                  In {selectedGoal.term} years investing the Break Even... due to compounding interest you would have accumulated <span className="font-bold italic">{diffOppCost.highestNum}</span>
                  <span className="text-[17px]">*</span>
                </li>
              </Tooltip>
              <li className="text-[14px] underline mb-1 dark:text-chartGreen text-green-700">
                Total interest accrued <span className="font-bold italic">{diffOppCost.totalInterst}</span>
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
                <span className="font-bold italic">{USDollar.format(Number((diff).toFixed(2)))}/mo</span> each payment gets invested and receives the benefit of compounding interest
              </li>
              <Tooltip title="The Stock/Bond/Investment Expected Return rate is what is being used to help estimate how much money you would have if you invested in the market." placement="top-start">
                <li className="text-[14px] underline mb-1 cursor-pointer">
                  In {selectedGoal.term} years investing the Break Even... due to compounding interest you would have accumulated <span className="font-bold italic">{diffOppCost.highestNum}</span>
                  <span className="text-[17px]">*</span>
                </li>
              </Tooltip>
              <li className="text-[14px] underline mb-1 dark:text-chartGreen text-green-700">
                Total interest accrued <span className="font-bold italic">{diffOppCost.totalInterst}</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Greater Than Section */}
      <div className="w-full h-auto sm:flex hidden items-center justify-center my-4 ">
        <h1 className="text-[15px]">
          {" "}
          {futureValueOfPresentValue(selectedGoal.price, selectedGoal.appreciation, selectedGoal.term) > diffOppCost.highestNumNoFormat ? (
            <>
              <span className="font-bold italic">{USDollar.format(Number(futureValueOfPresentValue(selectedGoal.price, selectedGoal.appreciation, selectedGoal.term)))}</span>{" "}
              <span className="text-[20px] mx-2 font-bold">{">"}</span> <span className="font-bold italic">{diffOppCost.highestNum}</span>
            </>
          ) : (
            <>
              Investing after {selectedGoal.term} years: <span className="font-bold italic">{diffOppCost.highestNum}</span> <span className="text-[20px] mx-2 font-bold">{">"}</span> Home appreciation
              after {selectedGoal.term} years:{" "}
              <span className="font-bold italic">{USDollar.format(Number(futureValueOfPresentValue(selectedGoal.price, selectedGoal.appreciation, selectedGoal.term)))}</span>
            </>
          )}
        </h1>
      </div>
      {/* Mobile Greater Than Section */}
      <div className="w-full flex sm:hidden flex-col justify-center items-center my-4 h-auto">
        <h1 className="text-[14px]">
          {futureValueOfPresentValue(selectedGoal.price, selectedGoal.appreciation, selectedGoal.term) > diffOppCost.highestNumNoFormat ? (
            <span className="font-bold italic">Home Value: {USDollar.format(Number(futureValueOfPresentValue(selectedGoal.price, selectedGoal.appreciation, selectedGoal.term)))}</span>
          ) : (
            <span>
              Investing: <span className="font-bold italic">{diffOppCost.highestNum}</span>
            </span>
          )}
        </h1>

        <span className="text-[18px] font-bold">{">"}</span>

        <h1 className="text-[14px]">
          {futureValueOfPresentValue(selectedGoal.price, selectedGoal.appreciation, selectedGoal.term) < diffOppCost.highestNumNoFormat ? (
            <span>
              Home Value: <span className="font-bold italic">{USDollar.format(Number(futureValueOfPresentValue(selectedGoal.price, selectedGoal.appreciation, selectedGoal.term)))}</span>
            </span>
          ) : (
            <span>
              Investing: <span className="font-bold italic">{diffOppCost.highestNum}</span>
            </span>
          )}
        </h1>
      </div>

      <div className="w-full flex flex-col h-auto">
        {/* Mortgage */}
        <div className="w-full flex flex-col mb-4">
          <h1 className="sm:text-base text-[15px] font-bold underline mb-[2px]">Mortgage</h1>
          <p className="text-[13px] text-wrap">
            So for a <span className="font-bold italic">{USDollar.format(selectedGoal.price)}</span> house, implementing the non-recoverable costs of homeownership you would have paid approx.{" "}
            <span className="font-bold italic">{USDollar.format(Number(oppCostFVWithBreakEvenAsPayment(selectedGoal.term, breakEvenPerMonth, selectedGoal.downPayment).toFixed(2)))}</span> over the
            course of your mortgage. Your home in {selectedGoal.term} years would be worth approx.{" "}
            <span className="font-bold italic">{USDollar.format(Number(futureValueOfPresentValue(selectedGoal.price, selectedGoal.appreciation, selectedGoal.term)))} </span>, if over the course of
            your mortgage your property appreciated at <span className="font-bold italic">{selectedGoal.appreciation}%</span> annually.
          </p>
        </div>

        {/* Investing */}
        <div className="w-full flex flex-col mb-4">
          <h1 className="sm:text-base text-[15px] font-bold underline mb-[2px]">Investing The Difference</h1>
          <p className="text-[13px] text-wrap">
            This is only works if you take the extra money you get from the difference in break even per month and rent, and decided to invest it. If done, you would reap the benefits of compounding interest. If you invested{" "}
            <span className="font-bold italic">{USDollar.format(Number((diff).toFixed(2)))}</span> each month, and your expected return rate over the course of 30 years averaged{" "}
            <span className="font-bold italic">{selectedGoal.opportunityCostRate}%</span> annually you would have <span className="font-bold italic">{diffOppCost.highestNum}</span>.
          </p>
        </div>

        <p className="sm:text-[15px] text-[14px]">
          * These scenarios are simply here to help show the numbers, in reality the expected returns used for these calculations are just averages. There not guaranteed, however they do give you a
          good idea of the opportunity cost associated with buying a home.
        </p>
      </div>
    </div>
  );
}
