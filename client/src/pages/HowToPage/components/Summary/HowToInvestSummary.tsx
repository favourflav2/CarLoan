import * as React from "react";

export interface IHowToInvestSummaryProps {}

export default function HowToInvestSummary(props: IHowToInvestSummaryProps) {
  return (
    <div className="w-full flex flex-col h-full my-10">
      {/* Content */}
      <div className="w-full flex flex-col">
        <h1 className="sm:text-[25px] text-[20px] underline mb-5">Summary</h1>

        <p className="text-[14px] leading-6">
          * My current investment strategy comes from a book that I am currently reading, The Little Book of Common Sense Investing by John C. Bogle.
          One of the chapters included "Win by Keeping It Simple" in it's title. This chapter basically explains this simple strategy, <span className="font-bold">Buy a portfolio
          that owns shares of every business in the United States and then hold those shares forever</span>.{" "}
        </p>
        <ul className="list-disc list-inside text-[14px] mt-2">
            <li>S&P 500</li>
            <li>The Total Stock Market Index</li>
        </ul>
      </div>
    </div>
  );
}
