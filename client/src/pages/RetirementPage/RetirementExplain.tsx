import * as React from "react";
import { UseSelector } from "../../redux/store";
import RetirementHowItWorksHave from "./RetirementHowItWorksHave";

export interface IRetirementExplainProps {
  haveHighNum: number;
  needFinalPrice:number
}

export default function RetirementExplain({ haveHighNum, needFinalPrice }: IRetirementExplainProps) {
  // Redux States
  const { shrinkDashboardSidebar, selectedGoal } = UseSelector((state) => state.app);
  //const dispatch = Dispatch();




  if (!selectedGoal) {
    return null;
  }

  return (
    <div className={`my-10 h-auto  flex flex-col ${shrinkDashboardSidebar ? "2xl:px-[80px]" : "p-4 2xl:px-[80px]"} w-full text-black dark:text-gray-300`}>
      <h1 className="text-[24px] mb-2">About The Retirement Calculator</h1>
      <p className="text-[15px] mb-3">
        Our free calculator estimates your retirement nest egg based on your current retirement savings contributions and then calculates how it will stretch over your retirement in today’s dollars,
        taking inflation into account.
      </p>

      <p className="text-[15px] ">
        Filling out the visible fields with your best estimate is enough to get a rough idea of where you stand. For a more accurate number, you can expand the "advanced details" to enter more
        information about your plans for retirement. Read more about these fields and the information you'll want to provide below.{" "}
      </p>

      {/* retirement details section */}
      <div className="w-full flex flex-col mt-5">
        <h1 className="text-[20px]  mb-2 font-semibold ">How to fill out your retirement details</h1>

        {/* Current retirement savings */}
        <div className="mb-3">
          <h1>
            <span className="font-semibold">Current retirement savings:</span>{" "}
            <span className="text-[15px]">
              Enter the total current balances of all your retirement savings accounts, including 401(k) plans, individual retirement accounts (IRAs) and any other accounts earmarked for retirement.
            </span>
          </h1>
        </div>

        {/* Monthly Contribution */}
        <div className="mb-3">
          <h1>
            <span className="font-semibold">Monthly contribution:</span>{" "}
            <span className="text-[15px]">
              This is the amount you save for retirement each month. Include contributions to your 401(k) (including your employer match), IRA and any other retirement accounts. Experts recommend
              saving 10% to 15% of your pretax income for retirement. When you enter a number in the monthly contribution field, the calculator will automatically translate that to a percentage of
              your income and display that figure below this field.
            </span>
          </h1>
        </div>

        {/* Monthly budget in retirement */}
        <div className="mb-3">
          <h1>
            <span className="font-semibold">Monthly budget in retirement:</span>{" "}
            <span className="text-[15px]">
              Your monthly budget in retirement is how much you think you’ll need each month to live comfortably throughout your retirement, before taxes. One way to estimate this is to look at your
              current spending and project how it might change in retirement.
            </span>
          </h1>
        </div>
      </div>

      {/* retirement advanced details section */}
      <div className="w-full flex flex-col mt-5">
        <h1 className="text-[20px]  mb-2 font-semibold ">How to fill out advanced details</h1>

        {/* Retirement age */}
        <div className="mb-3">
          <h1>
            <span className="font-semibold"> Retirement age:</span>{" "}
            <span className="text-[15px]">
              Enter the age you plan to retire. Age 67 is considered full retirement age (when you get your full Social Security benefits) for people born in 1960 or later.
            </span>
          </h1>
        </div>

        {/* Life expectancy */}
        <div className="mb-3">
          <h1>
            <span className="font-semibold">Life expectancy:</span>{" "}
            <span className="text-[15px]">This is how long you expect to live. You’ll want your retirement savings and income to last throughout your life, so it's a good idea to aim high here.</span>
          </h1>
        </div>

        {/* Pre-retirement rate of return */}
        <div className="mb-3">
          <h1>
            <span className="font-semibold">Pre-retirement rate of return:</span>{" "}
            <span className="text-[15px]">This is the rate of return you expect your investments to earn between now and retirement.</span>
          </h1>
        </div>

        {/* Nerdy Tip */}
        <div className="w-full flex flex-col my-5">
          <hr className="border-2 border-chartGreen" />
          {/* Content Box */}
          <div className="w-full h-[170px] bg-[#EADDCA] dark:bg-[#1814149c] p-8">
            <div className="w-auto flex items-center">
              <span className="text-[35px] mr-2">🤓</span> <h1 className="text-[18px]">Nerdy Tip</h1>
            </div>

            <p className=" mt-1">
              There's no way to predict future rates of return with certainty, and different types of investments carry different risk. In addition, we don't include sales charges and other fees
              associated with your investments in our estimated rates of return.
            </p>
          </div>
        </div>

        {/* Post-retirement rate of return */}
        <div className="mb-3">
          <h1>
            <span className="font-semibold">Post-retirement rate of return:</span>{" "}
            <span className="text-[15px]">
              Your rate of return during retirement is typically lower than pre-retirement because most people shift at least some of their portfolio to lower-risk investments.
            </span>
          </h1>
        </div>
      </div>

      {/* how it works */}
      <RetirementHowItWorksHave haveHighNum={haveHighNum} needFinalPrice={needFinalPrice}/>
    </div>
  );
}

