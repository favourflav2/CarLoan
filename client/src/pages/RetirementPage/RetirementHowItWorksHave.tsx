import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import EastIcon from "@mui/icons-material/East";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { setShowHaveExample } from "../../redux/features/applicationSlice";
import { AnimatePresence, motion, easeInOut } from "framer-motion";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { ErrorBoundary } from "react-error-boundary";

export interface IRetirementHowItWorksHaveProps {
  haveHighNum: number;
  needFinalPrice: number;
}

export default function RetirementHowItWorksHave({ haveHighNum, needFinalPrice }: IRetirementHowItWorksHaveProps) {
  // Redux States
  const { selectedGoal, showHaveExample, showNeedExample1 } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: `USD`,
  });
  if (!selectedGoal || selectedGoal?.type !== "Retirement") {
    return null;
  }

  const updatedPreRate = selectedGoal && selectedGoal?.preRate / 100;
  const time: number | null = selectedGoal && selectedGoal?.retireAge - selectedGoal?.currentAge;

  const newPostRate = selectedGoal?.postRate / 100;
  const newInflation = selectedGoal?.inflation / 100;
  const addInflationAndPostRate = (1 + newPostRate) / (1 + newInflation) - 1;

  return (
    <>
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
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
              {showHaveExample ? (
                <ArrowDropUpIcon onClick={() => dispatch(setShowHaveExample(0))} className=" cursor-pointer text-[28px]" />
              ) : (
                <ArrowDropDownIcon onClick={() => dispatch(setShowHaveExample(0))} className=" cursor-pointer text-[28px]" />
              )}
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
                    <span className="font-bold">{selectedGoal?.retireAge - selectedGoal?.currentAge}</span> {""}
                    <span className="text-[12px]">(Retire Age - Current Age)</span> years.
                  </p>

                  {/* List Items */}
                  <ul className="list-disc list-inside mt-3">
                    <li className="text-[13.5px]">1 Period = 1 Year</li>
                    <li className="text-[13.5px]">
                      Present Value Investment <span className="font-bold">PV</span> = {USDollar.format(selectedGoal?.savings)}
                    </li>
                    <li className="text-[13.5px]">
                      Number of Periods <span className="font-bold">t</span> = {selectedGoal?.retireAge - selectedGoal?.currentAge} (years)
                    </li>
                    <li className="text-[13.5px]">
                      Rate per Period R = {selectedGoal?.preRate}% (<span className="font-bold">r</span> = {updatedPreRate})
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

                    {/* Desktop Version */}
                    <div className="w-full md:flex hidden items-center mt-3">
                      {/* Calculating Future Value of the Present Value */}

                      <MathJax>{`\\(FV=PV(1 + \\frac{r}{m})^{(t * m)}\\)`}</MathJax>

                      <EastIcon className="mx-5" />

                      <MathJax>{`\\(FV=${selectedGoal?.savings}(1 + \\frac{${updatedPreRate}}{12})^{(${time} * 12)}\\)`}</MathJax>

                      <span className="mx-2">=</span>
                      <h1 className="text-[15px]"> Future value of current savings </h1>
                    </div>
                    {/* Mobile Version */}
                    <div className="w-full md:hidden flex flex-col justify-center items-center  mt-3">
                      {/* Calculating Future Value of the Present Value */}

                      <MathJax className="text-[13px]">{`\\(FV=PV(1 + \\frac{r}{m})^{(t * m)}\\)`}</MathJax>

                      <ArrowDownwardIcon className="my-3" />

                      <MathJax className="text-[13px]">{`\\(FV=${selectedGoal?.savings}(1 + \\frac{${updatedPreRate}}{12})^{(${time} * 12)}\\)`}</MathJax>

                      <ArrowDownwardIcon className="my-3" />
                      <h1 className="text-[15px]"> Future value of current savings </h1>
                    </div>
                  </div>

                  {/* Getting Future Value of PMT */}
                  <div className="w-full flex flex-col mt-8">
                    <h1 className="underline">
                      Calculating Future Value of Payments (<span className="text-[12.5px]">PMT {USDollar.format(selectedGoal?.monthlyContribution)}</span>)
                    </h1>
                    {/* Desktop Version */}
                    <div className="w-full md:flex hidden items-center mt-3 flex-col justify-center">
                      {/* Calculating Future Value of the Present Value */}

                      <div className="w-full flex items-center justify-center">
                        <MathJax className="text-[20px]">{"\\(FV=PMT \\frac{((1 + \\frac{r}{m})^{(t * m)} - 1)}{\\frac{r}{m}}\\)"}</MathJax>

                        <EastIcon className="mx-5" />

                        <MathJax className="text-[20px]">{`\\(FV=${selectedGoal?.monthlyContribution} \\frac{((1 + \\frac{${updatedPreRate}}{12})^{(${time} * 12)} - 1)}{\\frac{${updatedPreRate}}{12}}\\)`}</MathJax>
                      </div>

                      <span className="mx-2">=</span>
                      <h1 className="text-[15px]"> Future value of payments </h1>
                    </div>
                    {/* Mobile Version */}
                    <div className="w-full md:hidden flex flex-col justify-center items-center  mt-3">
                      {/* Calculating Future Value of the Present Value */}

                      <MathJax className="text-[13px]">{"\\(FV=PMT \\frac{((1 + \\frac{r}{m})^{(t * m)} - 1)}{\\frac{r}{m}}\\)"}</MathJax>

                      <ArrowDownwardIcon className="my-3" />

                      <MathJax className="text-[13px]">{`\\(FV=${selectedGoal?.monthlyContribution} \\frac{((1 + \\frac{${updatedPreRate}}{12})^{(${time} * 12)} - 1)}{\\frac{${updatedPreRate}}{12}}\\)`}</MathJax>

                      <ArrowDownwardIcon className="my-3" />
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

          {/* Need Function */}
          <div className="mb-3 flex flex-col w-full">
            <p className="text-[15px]">
              To calculate your target retirement savings total <span className="text-[16px] font-bold underline">(“What you’ll need”)</span>, I use your life expectancy to determine how much you’ll
              need (taking inflation into account) to match your projected monthly budget in retirement and have it last from retirement through the remainder of your life.
            </p>

            {/* Example */}
            <div className="w-auto flex items-center mt-5 mb-1">
              <h1 className="font-semibold mr-1">
                Example #2 (<span className="text-[12px]">Retrieve total amount for what you need</span>)
              </h1>
              {showNeedExample1 ? (
                <ArrowDropUpIcon onClick={() => dispatch(setShowHaveExample(1))} className=" cursor-pointer text-[28px]" />
              ) : (
                <ArrowDropDownIcon onClick={() => dispatch(setShowHaveExample(1))} className=" cursor-pointer text-[28px]" />
              )}
            </div>

            {/* Math and Example Container */}
            <AnimatePresence>
              {showNeedExample1 && (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, transition: { duration: 0.5, ease: easeInOut } }}
                  exit={{ x: -100, opacity: 0, transition: { duration: 0.5, ease: easeInOut } }}
                  className="w-full flex flex-col h-auto overflow-hidden"
                >
                  <p className="text-[15px] font-bold mb-2 text-green-700">
                    The first step in calculating what you need is getting the total amount using the payout annuity formula. By understanding you want to withdraw{" "}
                    <span className=" underline font-bold">{USDollar.format(selectedGoal?.budget)}</span> every month in retirement I can use the formula to get you an estimate on what you will need.
                    Which is proportionally related to your withdrawal amount.
                  </p>
                  <p className="text-[15px]">
                    Our current situation goes like this. You don't know how much you will need in your account to retire if you want to withdraw{" "}
                    <span className="font-bold">{USDollar.format(selectedGoal?.budget)}</span> for a total of{" "}
                    <span className="font-bold">{selectedGoal?.lifeExpectancy - selectedGoal?.retireAge}</span> years(life expectancy - retire age), and your retirement account will earn{" "}
                    <span className="font-bold">{selectedGoal?.postRate}%</span> interest and the inflation rate is <span className="font-bold">{selectedGoal?.inflation}%</span>. How much will you
                    need in your account when you retire?
                  </p>

                  {/* List Items */}
                  <ul className="list-disc list-inside mt-3">
                    <li className="text-[13.5px]">1 Period = 1 Year</li>
                    <li className="text-[13.5px]">
                      Present Value Investment <span className="font-bold">PV</span> = PV (unknown)
                    </li>
                    <li className="text-[13.5px]">
                      Number of Periods <span className="font-bold">t</span> = {selectedGoal?.lifeExpectancy - selectedGoal?.retireAge} (years)
                    </li>
                    <li className="text-[13.5px]">
                      Rate per Period R = {selectedGoal?.postRate}% (<span className="font-bold">r</span> = {selectedGoal?.postRate / 100})
                    </li>
                    <li className="text-[13.5px]">
                      Inflation per Period I = {selectedGoal?.inflation}% (<span className="font-bold">r</span> = {selectedGoal?.inflation / 100})
                    </li>
                    <li className="text-[13.5px]">
                      Coumpounding 12 times per period (monthly) <span className="font-bold">m</span> = 12
                    </li>
                    <li className="text-[13.5px]">
                      Withdraw Amount <span className="font-bold">w</span> = {USDollar.format(selectedGoal?.budget)}
                    </li>
                  </ul>

                  {/* Formualas */}

                  {/* Getting Real Interest Rate */}
                  {newInflation !== newPostRate && (
                    <div className="w-full flex flex-col mt-6">
                      <h1 className="underline">Getting the real interest rate (adjusted with inflation)</h1>
                      {/* Desktop Version */}
                      <div className="w-full md:flex hidden items-center mt-3">
                        {/* Calculating Future Value of the Present Value */}

                        <MathJax>{`\\(Real \\ Interest \\ Rate=(\\frac{1 \\ + \\ nominal \\ rate}{1 \\ + \\ interest \\ rate}) \\ - \\ 1\\)`}</MathJax>

                        <EastIcon className="mx-5" />

                        <MathJax>{`\\(Real \\ Interest \\ Rate=(\\frac{1 \\ + \\ ${selectedGoal?.postRate / 100}}{1 \\ + \\ ${selectedGoal?.inflation / 100}}) \\ - \\ 1\\)`}</MathJax>

                        <span className="mx-2">=</span>
                        <h1 className="text-[15px]"> {addInflationAndPostRate.toFixed(3)} </h1>
                      </div>

                      {/* Mobile Version */}
                      <div className="w-full md:hidden flex items-center justify-center flex-col mt-3">
                        {/* Calculating Future Value of the Present Value */}

                        <MathJax className=" text-[13px]">{`\\(R \\ I \\ R=(\\frac{1 \\ + \\ nominal \\ rate}{1 \\ + \\ interest \\ rate}) \\ - \\ 1\\)`}</MathJax>

                        <ArrowDownwardIcon className="my-3" />

                        <MathJax className=" text-[13px]">{`\\(Real \\ Interest \\ Rate=(\\frac{1 \\ + \\ ${selectedGoal?.postRate / 100}}{1 \\ + \\ ${
                          selectedGoal?.inflation / 100
                        }}) \\ - \\ 1\\)`}</MathJax>

                        <ArrowDownwardIcon className="my-3" />
                        <h1 className="text-[15px]">
                          {" "}
                          Real Interest Rate = <span className="font-bold">{addInflationAndPostRate.toFixed(3)}</span>{" "}
                        </h1>
                      </div>
                    </div>
                  )}

                  {/* Payout Annutiy  */}
                  {newInflation !== newPostRate && (
                    <div className="w-full flex  flex-col mt-8">
                      <h1 className="underline">Payout Annuity Formula solve for PV</h1>
                      {/* Desktop Version */}
                      <div className="w-full md:flex hidden items-center mt-3">
                        {/* Calculating Future Value of the Present Value */}

                        <MathJax className="text-[20px]">{"\\(PV= \\frac{w \\ (1 \\ - \\ (1 + \\frac{r}{m})^{(-t * m)})}{\\frac{r}{m}}\\)"}</MathJax>

                        <EastIcon className="mx-5" />

                        <MathJax className="text-[20px]">{`\\(PV= \\frac{${selectedGoal?.budget} \\ (1 \\ - \\ (1 + \\frac{${addInflationAndPostRate.toFixed(5)}}{12})^{(-${
                          selectedGoal?.lifeExpectancy - selectedGoal?.retireAge
                        } * m)})}{\\frac{${addInflationAndPostRate.toFixed(5)}}{12}}\\)`}</MathJax>

                        <span className="mx-2">=</span>
                        <h1 className="text-[15px] font-bold"> {USDollar.format(needFinalPrice)} </h1>
                      </div>

                      {/* Mobile Version */}
                      <div className="w-full md:hidden flex items-center justify-center flex-col mt-3">
                        {/* Calculating Future Value of the Present Value */}

                        <MathJax className="text-[13px]">{"\\(PV= \\frac{w \\ (1 \\ - \\ (1 + \\frac{r}{m})^{(-t * m)})}{\\frac{r}{m}}\\)"}</MathJax>

                        <ArrowDownwardIcon className="my-3" />

                        <MathJax className="text-[13px]">{`\\(PV= \\frac{${selectedGoal?.budget} \\ (1 \\ - \\ (1 + \\frac{${addInflationAndPostRate.toFixed(5)}}{12})^{(-${
                          selectedGoal?.lifeExpectancy - selectedGoal?.retireAge
                        } * m)})}{\\frac{${addInflationAndPostRate.toFixed(5)}}{12}}\\)`}</MathJax>

                        <ArrowDownwardIcon className="my-3" />
                        <h1 className="text-[15px]">
                          {" "}
                          Present Value = <span className="font-bold">{USDollar.format(needFinalPrice)}</span>{" "}
                        </h1>
                      </div>
                    </div>
                  )}

                  {newInflation === newPostRate && (
                    <div className="w-full flex flex-col mt-6">
                      <h1 className="text-[15px] text-red-500">* Since the interest rate is equal to the Post-retirement rate of return our rate becomes 0% </h1>

                      {/* Desktop Version */}
                      <div className="w-full md:flex hidden items-center mt-3">
                        {/* Calculating Future Value of the Present Value */}

                        <MathJax className="">{"\\(PV= w * (t \\ * \\ m)\\)"}</MathJax>

                        <EastIcon className="mx-5" />

                        <MathJax className="">{`\\(PV= ${selectedGoal?.budget} * (${selectedGoal?.lifeExpectancy - selectedGoal?.retireAge} \\ * \\ 12)\\)`}</MathJax>

                        <span className="mx-2">=</span>
                        <h1 className="text-[15px] font-bold"> {USDollar.format(needFinalPrice)} </h1>
                      </div>

                      {/* Mobile Version */}
                      <div className="w-full md:hidden flex items-center justify-center flex-col mt-3">
                        {/* Calculating Future Value of the Present Value */}

                        <MathJax className="text-[13px]">{"\\(PV= w * (t \\ * \\ m)\\)"}</MathJax>

                        <ArrowDownwardIcon className="my-3" />

                        <MathJax className="text-[13px]">{`\\(PV= ${selectedGoal?.budget} * (${selectedGoal?.lifeExpectancy - selectedGoal?.retireAge} \\ * \\ 12)\\)`}</MathJax>

                        <ArrowDownwardIcon className="my-3" />
                        <h1 className="text-[15px]">
                          {" "}
                          Present Value = <span className="font-bold">{USDollar.format(needFinalPrice)}</span>{" "}
                        </h1>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </MathJaxContext>
    </ErrorBoundary>
      
    </>
  );
}
