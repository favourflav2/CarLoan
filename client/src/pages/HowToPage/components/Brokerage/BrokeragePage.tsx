import * as React from "react";
import BrokerageSlider from "./Slider/BrokerageSlider";


export interface IBrokeragePageProps {}

export default function BrokeragePage(props: IBrokeragePageProps) {
  return (
    <div className="w-full flex flex-col h-full my-10">
      {/* Content */}
      <div className="w-full flex flex-col">
        <h1 className="sm:text-[25px] text-[20px] underline mb-5">Brokerage Accounts</h1>

        <p>
         - A brokerage account is an investment account that allows you to buy and sell securities like stocks, bonds, mutual funds, and
          exchange-traded funds (ETFs) through a financial institution. You can use the funds in your account for any purpose, such as saving for a
          big purchase or setting money aside for the future.
        </p>

        <h1 className="text-[19px] mt-5 mb-2 font-semibold">Here are some of the top brokerages</h1>

        <ul className="list-disc list-inside">
            <li>Charles Schwab</li>
            <li>Fidelity Investments</li>
            <li>Vanguard Group</li>
        </ul>

{/* Example */}
        <div className="w-full flex flex-col mt-5">
            <h1 className="text-[19px] mt-5 mb-2 font-semibold">Example</h1>

            <p className="text-[14px] mb-2">I personally use Vanguard as my brokerage account,
                this is how it looks. <span className=" italic">Images are from <a href="https://investor.vanguard.com/investment-products" target="_blank" rel="noreferrer noopener" className="text-blue-600 hover:text-blue-700 cursor-pointer">Vanguard</a></span> 
            </p>

            <BrokerageSlider />
            
        </div>
      </div>
    </div>
  );
}

// https://investor.vanguard.com/investment-products
