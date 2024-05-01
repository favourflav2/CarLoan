import * as React from "react";
import TitleAndBody from "./components/TitleAndBody";
import { UseSelector } from "../../redux/store";
import FivePercentRule from "./components/FivePercentRule";

export interface IOpportunityCostProps {}

export default function OpportunityCost(props: IOpportunityCostProps) {
  const { shrinkDashboardSidebar } = UseSelector((state) => state.app);
  return (
    <div className={`mt-8 h-auto w-full   flex flex-col items-center justify-center text-black dark:text-gray-300`}>
      {/* Content */}
      <div className="min-[900px]:w-[80%] w-[90%] h-full flex flex-col">
        {/* Title */}
        <div className="w-full flex items-center justify-center ">
          <h1 className="font-bold text-[32px]">Renting vs. buying: A simple calculation to help you decide</h1>
        </div>

        {/* Owning vs Renting */}
        <TitleAndBody
          header="Owning vs Renting"
          arrayOfText={[
            {
              index: 0,
              text: (
                <>
                  The 5% rule was invented by Ben Felix, a portfolio manager at PWL Capital based in Canada. This rule is aimed to help assess the rent vs buy decision in real estate industry. Buying
                  or renting is such a hard decisions among potential home buyers. The up and down sides of both renting and buying will be discussed further. However, since mortgage rates are ever
                  changing the 5% rule currently is now outdated. Within this section I hope I can explain the reason to which it is outdated and also show you the differences between renting and
                  buying a house.
                </>
              ),
            },
          ]}
        />

        {/* Owning vs Renting */}
        <FivePercentRule />
      </div>
    </div>
  );
}
