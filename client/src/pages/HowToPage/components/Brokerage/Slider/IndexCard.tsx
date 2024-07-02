import * as React from "react";

export interface IIndexCardProps {
  title: string;
  text: string;
  buttonText: string;
  mobile: boolean;
}

export default function IndexCard({ title, text, buttonText, mobile }: IIndexCardProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center md:mt-0 mt-5">
      <h1 className="text-[20px] font-semibold mb-3">{title}</h1>

      <p className="text-[14px] mb-3">{text}</p>
      <a
        href={
          mobile ? "https://investor.vanguard.com/client-benefits/mobile-apps" : "https://personal1.vanguard.com/mmx-move-money/registration-check"
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className={`${mobile ? "bg-black dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-300 dark:text-black " : "bg-[#e23232] hover:bg-red-700"} text-white py-3 px-5 rounded-full`}>
          {buttonText}
        </button>
      </a>
    </div>
  );
}


