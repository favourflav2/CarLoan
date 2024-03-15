import * as React from "react";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { UseSelector, Dispatch } from "../../redux/store";
import { Tooltip } from "@mui/material";
import { setSelectedGoal } from "../../redux/features/applicationSlice";

interface AgeNum {
  age: number;
  value: number;
}

interface ForLoopData {
  data: Array<AgeNum>;
  highestNum: string;
  highestNumNoFormat: number;
}

export interface IRetirementSummaryProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  have: ForLoopData;
  need: ForLoopData;
  haveRetireBudget: {
    value: number;
    valueNoInflation: number;
  };
  needMonthlyContribution: number;
}

export default function RetirementSummary({ setShow, show, need, have, haveRetireBudget, needMonthlyContribution }: IRetirementSummaryProps) {
  // Redux States
  const { selectedGoal } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: `USD`,
  });

  if (!selectedGoal) {
    dispatch(setSelectedGoal(null));
    return null;
  }
  return (
    <>
      {/* Desktop Content */}
      <div className="w-full xl:w-[80%] 2xl:w-[65%] h-auto md:grid hidden grid-cols-2 gap-x-10 mt-4">
        {/* Left What You Have Summary */}
        <div className="w-full flex flex-col ">
          {/* Title */}
          <h1 className="text-gray-600 dark:text-gray-400 text-[15px]">
            Current Retirement Plan (<span className="text-[11px]">What you have</span>)
          </h1>

          {/* Items */}
          <div className="w-full h-auto flex flex-col mt-3">
            {/* Savings */}
            <div className="w-full flex items-center justify-between">
              <p className="">Total retirement savings</p>
              <h1 className=" text-chartGreen font-semibold">{have ? have.highestNum : 0}</h1>
            </div>

            <hr className="border my-2 border-gray-300" />

            {/* Monthly Contribution */}
            <div className="w-full flex items-center justify-between">
              <p className="">Monthly Contribution</p>
              <h1 className=" text-chartGreen font-semibold">{USDollar.format(selectedGoal?.monthlyContribution)}</h1>
            </div>

            <hr className="border my-2 border-gray-300" />

            {/* Age Retirement Savings Run Out */}
            <div className="w-full flex items-center justify-between">
              <p className="">Age Retirement Savings Run Out</p>
              <h1 className=" text-chartGreen font-semibold">{selectedGoal?.age?.lifeExpectancy}</h1>
            </div>

            <hr className="border my-2 border-gray-300" />

            {/* Budget In Retirement */}
            <div className="w-full fle flex-col">
              <div className="w-full flex items-center justify-between">
                <p className="">Budget In Retirement</p>
                <h1 className=" text-gray-400 font-semibold">-</h1>
              </div>

              {show && (
                <div className="w-full pl-3 mt-1 h-auto flex flex-col">
                  {/* Inflation Num */}
                  <div className="w-full flex items-center justify-between my-1">
                    {/* Adjusted With Inflation */}
                    <div className="w-auto flex items-center">
                      <HorizontalRuleIcon className="text-[18px] mr-1" />
                      <p className="text-[13.5px]">Adjusted With Inflation</p>
                    </div>

                    {/* Price */}
                    <h1 className=" text-chartGreen font-semibold text-[15px]">{USDollar.format(haveRetireBudget.value)}</h1>
                  </div>

                  {/* No Infltion Num */}
                  <div className="w-full flex items-center justify-between">
                    {/* Adjusted With Inflation */}
                    <div className="w-auto flex items-center">
                      <HorizontalRuleIcon className="text-[18px] mr-1" />
                      <p className="text-[13.5px]">Not Adjusted With Inflation</p>
                    </div>

                    {/* Price */}
                    <h1 className=" text-chartGreen font-semibold text-[15px]">{USDollar.format(haveRetireBudget.valueNoInflation)}</h1>
                  </div>
                </div>
              )}

              <h1 className={`flex w-full justify-end ${show && "mt-2"} text-[14px] underline cursor-pointer`} onClick={() => setShow((item) => !item)}>
                {" "}
                {show ? "Hide" : "Show"}
              </h1>
            </div>
          </div>
        </div>

        {/* Right What You Need Summary */}
        <div className="w-full flex flex-col ">
          {/* Title */}
          <h1 className="text-gray-600 dark:text-gray-400 text-[15px]">
            Target Retirement Plan (<span className="text-[11px]">What you need</span>)
          </h1>

          {/* Items */}
          <div className="w-full h-auto flex flex-col mt-3">
            {/* Savings */}
            <div className="w-full flex items-center justify-between">
              <p className="">Total retirement savings</p>
              <h1 className=" text-chartGreen font-semibold">{need ? need.highestNum : 0}</h1>
            </div>

            <hr className="border my-2 border-gray-300" />

            {/* Monthly Contribution */}
            <div className="w-full flex items-center justify-between">
              <div className="w-auto flex items-center">
                <p className="mr-1">Monthly Contribution</p>
                <Tooltip title="Approximate monthly contribution based on total retirement savings." placement="top">
                  <HelpOutlineIcon className="text-[15px]" />
                </Tooltip>
              </div>
              <h1 className=" text-chartGreen font-semibold">{USDollar.format(needMonthlyContribution)}</h1>
            </div>

            <hr className="border my-2 border-gray-300" />

            {/* Age Retirement Savings Run Out */}
            <div className="w-full flex items-center justify-between">
              <p className="">Age Retirement Savings Run Out</p>
              <h1 className=" text-chartGreen font-semibold">{selectedGoal?.age?.lifeExpectancy}</h1>
            </div>

            <hr className="border my-2 border-gray-300" />

            {/* Budget In Retirement */}
            <div className="w-full flex items-center justify-between">
              <p className="">Budget In Retirement</p>
              <h1 className=" text-chartGreen font-semibold">{USDollar.format(selectedGoal?.budget)}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------Mobile Content------------------------ */}
      <div className="w-full flex md:hidden flex-col">
        {/*  What You Have Summary */}
        <div className="w-full flex flex-col my-2">
          {/* Title */}
          <h1 className="text-gray-600 dark:text-gray-400 text-[15px]">
            Current Retirement Plan (<span className="text-[11px]">What you have</span>)
          </h1>

          {/* Items */}
          <div className="w-full h-auto flex flex-col mt-3">
            {/* Savings */}
            <div className="w-full flex items-center justify-between">
              <p className="text-[14px] sm:text-base">Total retirement savings</p>
              <h1 className=" text-chartGreen font-semibold text-[15px] sm:text-base">{have ? have.highestNum : 0}</h1>
            </div>

            <hr className="border my-2 border-gray-300" />

            {/* Monthly Contribution */}
            <div className="w-full flex items-center justify-between">
              <p className="text-[14px] sm:text-base">Monthly Contribution</p>
              <h1 className=" text-chartGreen font-semibold text-[15px] sm:text-base">{USDollar.format(selectedGoal?.monthlyContribution)}</h1>
            </div>

            <hr className="border my-2 border-gray-300" />

            {/* Age Retirement Savings Run Out */}
            <div className="w-full flex items-center justify-between">
              <p className="text-[14px] sm:text-base">Age Retirement Savings Run Out</p>
              <h1 className=" text-chartGreen font-semibold text-[15px] sm:text-base">{selectedGoal?.age?.lifeExpectancy}</h1>
            </div>

            <hr className="border my-2 border-gray-300" />

            {/* Budget In Retirement */}
            <div className="w-full fle flex-col">
              <div className="w-full flex items-center justify-between">
                <p className="text-[14px] sm:text-base">Budget In Retirement</p>
                <h1 className=" text-gray-400 font-semibold">-</h1>
              </div>

              {show && (
                <div className="w-full pl-3 mt-1 h-auto flex flex-col">
                  {/* Inflation Num */}
                  <div className="w-full flex items-center justify-between my-1">
                    {/* Adjusted With Inflation */}
                    <div className="w-auto flex items-center">
                      <HorizontalRuleIcon className="text-[18px] mr-1" />
                      <p className="text-[13.5px]">Adjusted With Inflation</p>
                    </div>

                    {/* Price */}
                    <h1 className=" text-chartGreen font-semibold text-[15px] sm:text-base ">{USDollar.format(haveRetireBudget.value)}</h1>
                  </div>

                  {/* No Infltion Num */}
                  <div className="w-full flex items-center justify-between">
                    {/* Adjusted With Inflation */}
                    <div className="w-auto flex items-center">
                      <HorizontalRuleIcon className="text-[18px] mr-1" />
                      <p className="text-[13.5px]">Not Adjusted With Inflation</p>
                    </div>

                    {/* Price */}
                    <h1 className=" text-chartGreen font-semibold text-[15px] sm:text-base ">{USDollar.format(haveRetireBudget.valueNoInflation)}</h1>
                  </div>
                </div>
              )}

              <h1 className={`flex w-full justify-end ${show && "mt-2"} text-[14px] underline cursor-pointer`} onClick={() => setShow((item) => !item)}>
                {" "}
                {show ? "Hide" : "Show"}
              </h1>
            </div>
          </div>
        </div>

        {/* Right What You Need Summary */}
        <div className="w-full flex flex-col ">
          {/* Title */}
          <h1 className="text-gray-600 dark:text-gray-400 text-[15px]">
            Target Retirement Plan (<span className="text-[11px]">What you need</span>)
          </h1>

          {/* Items */}
          <div className="w-full h-auto flex flex-col mt-3">
            {/* Savings */}
            <div className="w-full flex items-center justify-between">
              <p className="text-[14px] sm:text-base">Total retirement savings</p>
              <h1 className=" text-chartGreen font-semibold text-[15px] sm:text-base">{need ? need.highestNum : 0}</h1>
            </div>

            <hr className="border my-2 border-gray-300" />

            {/* Monthly Contribution */}
            <div className="w-full flex items-center justify-between">
              <div className="w-auto flex items-center">
                <p className="mr-1 text-[14px] sm:text-base">Monthly Contribution</p>
                <Tooltip title="Approximate monthly contribution based on total retirement savings." placement="top">
                  <HelpOutlineIcon className="text-[15px]" />
                </Tooltip>
              </div>
              <h1 className=" text-chartGreen font-semibold text-[15px] sm:text-base">{USDollar.format(needMonthlyContribution)}</h1>
            </div>

            <hr className="border my-2 border-gray-300" />

            {/* Age Retirement Savings Run Out */}
            <div className="w-full flex items-center justify-between">
              <p className="text-[14px] sm:text-base">Age Retirement Savings Run Out</p>
              <h1 className=" text-chartGreen font-semibold text-[15px] sm:text-base">{selectedGoal?.age?.lifeExpectancy}</h1>
            </div>

            <hr className="border my-2 border-gray-300" />

            {/* Budget In Retirement */}
            <div className="w-full flex items-center justify-between">
              <p className="text-[14px] sm:text-base">Budget In Retirement</p>
              <h1 className=" text-chartGreen font-semibold text-[15px] sm:text-base">{USDollar.format(selectedGoal?.budget)}</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
