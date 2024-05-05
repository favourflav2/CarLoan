import * as React from "react";
import { FTVOppCost } from "../../../components/helperFunctions/oppCostFunctions/oppCostFunction";
import { HouseObjWithFormattedData } from "../../../redux/features/modalSlices/houseSlice";
import OppCostChart from "../../../components/charts/OppCostChart";
import { HouseMonthlyPayment } from "../../../components/helperFunctions/loanfunctions/HouseLoanFuntion";
import { FormControl, NativeSelect } from "@mui/material";

export interface IOppCostChartContainerProps {
  breakEvenOppCost: FTVOppCost | undefined;
  rentOppCost: FTVOppCost | undefined;
  diffOppCost: FTVOppCost | undefined;
  selectedGoal: HouseObjWithFormattedData;
  monthlyPayment: HouseMonthlyPayment;
}

export default function OppCostChartContainer({ breakEvenOppCost, rentOppCost, diffOppCost, selectedGoal, monthlyPayment }: IOppCostChartContainerProps) {
  const [view, setView] = React.useState("Graph View");

  const handleChange = (event: { target: { value: string } }) => {
    setView(event.target.value);
  };

  return (
    <div className="w-full h-auto flex flex-col">
      {/* Content */}
      <div className="w-full h-full flex flex-col">


        {/* Select View */}
        <div className=" sm:flex hidden items-center w-auto h-auto">
          <h1
            className={`sm:mr-8 mr-5 sm:text-base text-[15px] cursor-pointer ${view === "Graph View" ? "underline text-chartGreen font-bold" : "text-gray-400"}`}
            onClick={() => setView("Graph View")}
          >
            Graph View
          </h1>
          <h1
            className={`  cursor-pointer ${view === "Break Even" ? "underline text-chartGreen font-bold" : "text-gray-400"} sm:mr-8 mr-5 sm:text-base text-[15px]`}
            onClick={() => setView("Break Even")}
          >
            Break Even
          </h1>
          <h1 className={`  cursor-pointer ${view === "Rent" ? "underline text-chartGreen font-bold" : "text-gray-400"} sm:mr-8 mr-5 sm:text-base text-[15px]`} onClick={() => setView("Rent")}>
            Rent
          </h1>
          <h1 className={`cursor-pointer ${view === "Diff." ? "underline text-chartGreen font-bold" : "text-gray-400"} sm:mr-8 mr-5 sm:text-base text-[15px]`} onClick={() => setView("Diff.")}>
            Diff.
          </h1>
          <h1
            className={`  cursor-pointer ${view === "Summary View" ? "underline text-chartGreen font-bold" : "text-gray-400"} sm:mr-8 mr-5 sm:text-base text-[15px]`}
            onClick={() => setView("Summary View")}
          >
            Summary View
          </h1>
        </div>

        <div className="sm:hidden block">
          <FormControl variant="standard">
            <NativeSelect
              id="demo-customized-select-native"
              value={view}
              onChange={handleChange}
              sx={{
                boxShadow: "none",
                ".MuiNativeSelect-standard": {
                  color: "#00A36C",
                  fontWeight: "bold",
                  background: "inherit",
                },
                "&::after": {
                  borderColor: "#00A36C",
                },
              }}
              className="mb-[2px]"
            >
              <option value={"Graph View"}>Graph View</option>
              <option value={"Break Even"}>Break Even</option>
              <option value={"Rent"}>Rent</option>
              <option value={"Diff."}>Diff.</option>
              <option value={"Summary View"}>Summary View</option>
            </NativeSelect>
          </FormControl>
        </div>

        {/* Horizontal Line */}
        <hr className="border my-1 border-gray-300" />

        {/* Chart and Chart content goes here */}
        <div className="w-full h-auto rounded-lg shadow-[0px_6px_15px_0px_#00000024] flex flex-col p-4">
          {/* Title */}
          <div className="flex flex-col w-auto h-auto mb-5">
            <h1 className="text-[26px] font-bold">Rent vs Owning ?</h1>
            <h1 className="text-[13px] italic">* The difference in expected returns between property and stocks represents an opportunity cost</h1>
          </div>

          {/* Explantion */}
          <div className="w-auto flex flex-col h-auto">
            <p className="text-[13.5px] mb-2">~ What if instead of paying the break even per month you invested it ?</p>

            <p className="text-[13.5px] mb-2">~ What if you didn't have to pay rent, instead you invested the amount you would pay in rent in the market ? </p>

            <p className="text-[13.5px] mb-2">
              ~ What if you knew buying wasn’t an option but instead used the 5% rule or something similar and decided to take the monthly cost of owning - the rent you are paying and invested the
              difference ?
            </p>
          </div>

          {/* Chart */}
          {breakEvenOppCost && rentOppCost && diffOppCost && (
            <OppCostChart breakEvenOppCost={breakEvenOppCost} rentOppCost={rentOppCost} diffOppCost={diffOppCost} selectedGoal={selectedGoal} monthlyPayment={monthlyPayment} />
          )}
        </div>
      </div>
    </div>
  );
}
