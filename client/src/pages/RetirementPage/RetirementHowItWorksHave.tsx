import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import EastIcon from "@mui/icons-material/East";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { setShowHaveExample } from "../../redux/features/applicationSlice";
import { AnimatePresence, motion, easeInOut } from "framer-motion";

export interface IRetirementHowItWorksHaveProps {
  haveHighNum: number;
}

export default function RetirementHowItWorksHave({ haveHighNum }: IRetirementHowItWorksHaveProps) {
  // Redux States
  const {  selectedGoal, showHaveExample } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: `USD`,
  });

  const updatedPreRate = selectedGoal && selectedGoal?.preRate / 100;
  const time: number | null = selectedGoal && selectedGoal?.age?.retireAge - selectedGoal?.age?.currentAge;

  if (!selectedGoal) {
    return null;
  }
  return (
    <>
      <MathJaxContext>
        <div className="w-full flex flex-col mt-5">
          <h1 className="text-[20px]  mb-2 font-semibold ">How the retirement calculator works</h1>

          {/* Have Function */}
          <div className="mb-3 flex flex-col w-full">
            <p className="text-[15px]">
              To come up with my estimate of the total amount of savings you’ll have for retirement <span className="text-[16px] font-bold underline">(“What you’ll have”)</span>, I start with your
              current age and how much you’ve saved so far. Using your income and savings contributions, I calculate how much more you’ll save between now and your projected retirement date.
            </p>

            {/* Example */}
            <div className="w-auto flex items-center mt-5 mb-1">
              <h1 className="font-semibold mr-1">Example #1</h1>
              {showHaveExample ? <ArrowDropUpIcon onClick={() => dispatch(setShowHaveExample())} className=" cursor-pointer text-[28px]" /> : <ArrowDropDownIcon onClick={() => dispatch(setShowHaveExample())} className=" cursor-pointer text-[28px]" />}
            </div>

            {/* Math and Example Container */}
            <AnimatePresence>
              {showHaveExample && (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, transition: { duration: 0.5, ease: easeInOut } }}
                  exit={{ x: -100, opacity: 0, transition: { duration: 0.5, ease: easeInOut } }}
                  className="w-full flex flex-col h-auto"
                >
                  <p className="text-[15px]">
                    Currently you have <span className="font-bold">{USDollar.format(selectedGoal?.savings)}</span> in savings and will start to save{" "}
                    <span className="font-bold">{USDollar.format(selectedGoal?.monthlyContribution)}</span> per month in an account that yields{" "}
                    <span className="font-bold">{selectedGoal?.preRate}%</span> per year. You will make your deposits at the end of each month. You want to know the value of your investment in {""}
                    <span className="font-bold">{selectedGoal?.age?.retireAge - selectedGoal?.age?.currentAge}</span> {""}
                    <span className="text-[12px]">(Retire Age - Current Age)</span> years.
                  </p>

                  {/* List Items */}
                  <ul className="list-disc list-inside mt-3">
                    <li className="text-[13.5px]">1 Period = 1 Year</li>
                    <li className="text-[13.5px]">
                      Present Value Investment <span className="font-bold">PV</span> = {USDollar.format(selectedGoal?.savings)}
                    </li>
                    <li className="text-[13.5px]">
                      Number of Periods <span className="font-bold">t</span> = {selectedGoal?.age?.retireAge - selectedGoal?.age?.currentAge} (years)
                    </li>
                    <li className="text-[13.5px]">
                      Rate per Period R = 6% (<span className="font-bold">r</span> = 0.06)
                    </li>
                    <li className="text-[13.5px]">
                      Coumpounding 12 times per period (monthly) <span className="font-bold">m</span> = 12
                    </li>
                    <li className="text-[13.5px]">
                      Payment Amount <span className="font-bold">PMT</span> = ${selectedGoal?.monthlyContribution}
                    </li>
                  </ul>

                  {/* Formualas */}

                  {/* Getting Future Value of the PV */}
                  <div className="w-full flex flex-col mt-6">
                    <h1 className="underline">
                      Calculating Future Value of the Present Value (<span className="text-[12.5px]">Current Savings {USDollar.format(selectedGoal?.savings)}</span>)
                    </h1>

                    <div className="w-full flex items-center mt-3">
                      {/* Calculating Future Value of the Present Value */}

                      <MathJax>{`\\(FV=PV(1 + \\frac{r}{m})^{(t * m)}\\)`}</MathJax>

                      <EastIcon className="mx-5" />

                      <MathJax>{`\\(FV=${selectedGoal?.savings}(1 + \\frac{${updatedPreRate}}{12})^{(${time} * 12)}\\)`}</MathJax>

                      <span className="mx-2">=</span>
                      <h1 className="text-[15px]"> Future value of current savings </h1>
                    </div>
                  </div>

                  {/* Getting Future Value of PMT */}
                  <div className="w-full flex flex-col mt-8">
                    <h1 className="underline">
                      Calculating Future Value of Payments (<span className="text-[12.5px]">PMT {USDollar.format(selectedGoal?.monthlyContribution)}</span>)
                    </h1>

                    <div className="w-full flex items-center mt-3">
                      {/* Calculating Future Value of the Present Value */}

                      <MathJax className="text-[20px]">{"\\(FV=PMT \\frac{((1 + \\frac{r}{m})^{(t * m)} - 1)}{\\frac{r}{m}}\\)"}</MathJax>

                      <EastIcon className="mx-5" />

                      <MathJax className="text-[20px]">{`\\(FV=${selectedGoal?.monthlyContribution} \\frac{((1 + \\frac{${updatedPreRate}}{12})^{(${time} * 12)} - 1)}{\\frac{${updatedPreRate}}{12}}\\)`}</MathJax>

                      <span className="mx-2">=</span>
                      <h1 className="text-[15px]"> Future value of payments </h1>
                    </div>

                    <div className="w-full flex flex-col mt-4">
                      <h1 className="mb-2 text-[15px]">Total Future Value = Future Value of the Present Value + Future Value of Payments</h1>
                      <h1 className=" text-[15px]">
                        Future Value of PV (<span className="text-[12.5px]">Savings {USDollar.format(selectedGoal?.savings)}</span>) + Future Value of Payments ={" "}
                        <span className="font-bold">{USDollar.format(haveHighNum)}</span>
                      </h1>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </MathJaxContext>
    </>
  );
}
