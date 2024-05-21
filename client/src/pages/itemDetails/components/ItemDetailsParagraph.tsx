import * as React from "react";
import { Link } from "react-router-dom";
import CreditTable from "../../../components/tables/CreditTable";

export interface IItemDetailsParagraphProps {}

export default function ItemDetailsParagraph(props: IItemDetailsParagraphProps) {
  return (
    <div className="w-full h-auto flex flex-col sm:mt-10 2xl:px-[180px] xl:px-[100px] dark:text-darkText text-lightText">
      <h1 className="w-full flex justify-center sm:text-[30px] text-[20px] font-semibold mb-1">Amorization Schedule</h1>

      <p className="indent-5 mb-2 sm:text-base text-[14px]">
        Consumer credit reporting company Experian releases average auto loan interest rates in its quarterly Automotive Finance Market report. In the third quarter of 2023, the overall average auto
        loan interest rate was 7.03% for new cars and 11.35% for used cars. -{" "}
        <span className=" italic text-blue-500 font-medium cursor-pointer">
          <Link target="_blank" to="https://www.nerdwallet.com/article/loans/auto-loans/average-car-loan-interest-rates-by-credit-score">
            NerdWallet
          </Link>
        </span>
      </p>
      <p className="indent-5 sm:text-base text-[14px]">
        Since the average interest rate for used cars is 11.35%, we will set the interest rate at that. However, feel free to change it and apply an interest rate to your pleasing.
      </p>

      <h1 className="w-full flex justify-center sm:text-[25px] text-[19px] mt-8 mb-2 ">Average car loan interest rates by credit score</h1>
      <CreditTable />
    </div>
  );
}
