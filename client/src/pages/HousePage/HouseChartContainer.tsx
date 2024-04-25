import * as React from "react";
import { USDollar } from "../CarPage/CarPage";
import HouseChart from "../../components/charts/HouseChart";
import { Divider, Checkbox, Tooltip } from "@mui/material";
import { HouseMonthlyPayment } from "../../components/helperFunctions/loanfunctions/HouseLoanFuntion";
import { HouseObjWithFormattedData, updateShowTax } from "../../redux/features/modalSlices/houseSlice";
import { LoanAmmortizationType } from "../../components/helperFunctions/loanfunctions/LoanFunction";
import { ExtraNumberYears } from "../../components/helperFunctions/loanfunctions/HouseLoanFuntion";
import { MyLoanForLoop } from "../../components/helperFunctions/loanfunctions/LoanFunction";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Dispatch } from "../../redux/store";
import { editShowTaxForHouse } from "../../redux/features/applicationSlice";

export interface IHouseChartContainerProps {
  monthlyPayment: HouseMonthlyPayment;
  view: string;
  setView: React.Dispatch<React.SetStateAction<string>>;
  selectedGoal: HouseObjWithFormattedData;
  regualrLoanAmmortization: LoanAmmortizationType | undefined;
  extraNumberOfYears: ExtraNumberYears | undefined;
  extraLoanAmmortization: MyLoanForLoop[] | undefined;
}

export default function HouseChartContainer({ monthlyPayment, selectedGoal, regualrLoanAmmortization, extraNumberOfYears, extraLoanAmmortization, setView, view }: IHouseChartContainerProps) {
  const dispatch = Dispatch();

  const { mortgageInsurance, extraPayment, showTax } = selectedGoal;

  function returnTotalTaxes(value: HouseMonthlyPayment) {
    const { mortgageInsurance, insurance, propertyTax } = value;

    return mortgageInsurance > 0 ? Number((mortgageInsurance + insurance + propertyTax).toFixed(2)) : Number((insurance + propertyTax).toFixed(2));
  }

  function addMonthlyPaymentWithTaxes(value: HouseMonthlyPayment) {
    const { mortgageInsurance, insurance, propertyTax, monthlyPayment, extraMonthlyPayment } = value;

    const totalTaxes = mortgageInsurance > 0 ? Number((mortgageInsurance + insurance + propertyTax).toFixed(2)) : Number((insurance + propertyTax).toFixed(2));

    return {
      totalMonthlyPayment: USDollar.format(Number((totalTaxes + monthlyPayment).toFixed(2))),
      totalExtraMonthlyPayment: USDollar.format(Number((totalTaxes + extraMonthlyPayment).toFixed(2))),
    };
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(editShowTaxForHouse(selectedGoal));
    dispatch(updateShowTax({ id: selectedGoal.id }));
  }

  function returnMonthlyPaymentMinusMIP(value: HouseMonthlyPayment, totalM:string){
    const { mortgageInsurance } = value;

    let res = parseFloat(totalM.replace(/[,%$]/gm, ""))

    res = res - mortgageInsurance

    return USDollar.format(Number((res).toFixed(2)))
  }


  return (
    <div className="w-full h-full flex flex-col my-5">
      <h1 className="text-[19px] font-semibold">Retirement savings at age </h1>

      <div className="w-auto flex items-center mt-3 relative">
        <Checkbox
          checked={showTax === "monthlyPaymentWithTax"}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
          className="m-0 p-0"
          size="small"
          sx={{
            color: "#00A36C",
            "&.Mui-checked": {
              color: "#00A36C",
            },
          }}
        />
        <label htmlFor="" className="text-[13px]">
          {showTax === "monthlyPaymentWithTax" ? "Show monthly payment w/ no taxes" : "Show monthly payment w/ taxes"}
        </label>
      </div>

      {/* Numbers */}
      <div className="w-auto flex sm:flex-row flex-col md:justify-normal justify-around  my-5">
        {/* What You Have Number */}
        <div className="w-auto flex flex-col">
          <h1 className="mb-2 sm:text-[17px] text-[15px] text-lightText dark:text-white font-bold dark:font-normal">
            {showTax === "monthlyPaymentWithTax" ? "Monthly Payment w/ Taxes" : "Monthly Payment"}
          </h1>

          <div className="w-auto flex ">
            <h1 className="sm:text-[21px] text-[19px] font-semibold text-chartGreen">
              {showTax === "monthlyPaymentWithNoTax" ? USDollar.format(Number(monthlyPayment.monthlyPayment.toFixed(2))) : addMonthlyPaymentWithTaxes(monthlyPayment).totalMonthlyPayment}
            </h1>
            { mortgageInsurance > 0 && <Tooltip title={`When you have 22% equity in your home, legally your mortgage insurance will be removed. When your mortgage insurance is removed, your new monthly payment will be ${returnMonthlyPaymentMinusMIP(monthlyPayment,addMonthlyPaymentWithTaxes(monthlyPayment).totalMonthlyPayment)}`} placement="top">
              <p className="cursor-pointer text-[18px] ml-[2px] sm:block hidden">*</p>
            </Tooltip>}
          </div>

          {/*Total Amount Paid with Taxes Monthly P */}
          <AnimatePresence>
            {showTax === "monthlyPaymentWithTax" && (
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1, transition: { duration: 0.2, ease: easeInOut } }}
                exit={{ opacity: [0.8, 0.5, 0], transition: { duration: 0.2, ease: easeInOut } }}
                className="w-auto flex flex-col mt-2"
              >
                {/* Monthly Payment */}
                <div className="w-auto flex items-center">
                  <div className="w-auto flex items-center">
                    <p className="text-[12.5px]">
                      Monthly Payment - <span className="font-bold">{USDollar.format(Number(monthlyPayment?.monthlyPayment.toFixed(2)))}</span>
                    </p>
                  </div>
                </div>

                {/* Property Tax */}
                <div className="w-auto flex items-center">
                  <div className="w-auto flex items-center">
                    <p className="text-[12.5px]">
                      Property Tax - <span className="font-bold">{USDollar.format(Number(monthlyPayment?.propertyTax.toFixed(2)))}</span>
                    </p>
                  </div>
                </div>

                {/* Mortgage Insurance*/}
                {mortgageInsurance > 0 && (
                  <div className="w-auto flex items-center">
                    <div className="w-auto flex items-center">
                      <p className="text-[12.5px]">
                        Mortgage Insurance- <span className="font-bold">{USDollar.format(Number(monthlyPayment?.mortgageInsurance.toFixed(2)))}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Home Owners Insurance */}
                <div className="w-auto flex items-center">
                  <div className="w-auto flex items-center">
                    <p className="text-[12.5px]">
                      Home Owners Insurance - <span className="font-bold">{USDollar.format(Number(monthlyPayment?.insurance.toFixed(2)))}</span>
                    </p>
                  </div>
                </div>

                {/* Total Taxes */}
                <div className="w-auto flex items-center underline">
                  <div className="w-auto flex items-center">
                    <p className="text-[12.5px]">
                      Total Taxes - <span className="font-bold">{USDollar.format(returnTotalTaxes(monthlyPayment))}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <Divider orientation="vertical" flexItem className="border border-gray-300 md:mx-8 sm:my-0 my-3" />

        {/* What You Need Number */}
        <div className="w-auto flex flex-col">
          <h1 className="mb-2 sm:text-[17px] text-[15px] text-lightText dark:text-white font-bold dark:font-normal">
            {showTax === "monthlyPaymentWithTax" ? "Extra Monthly Payment w/ Taxes" : "Extra Monthly Payment"}
          </h1>

          <div className="w-auto flex ">
          <h1 className="sm:text-[21px] text-[19px] font-semibold text-chartYellow">
            {extraPayment <= 0
              ? "-"
              : showTax === "monthlyPaymentWithNoTax"
              ? USDollar.format(Number(monthlyPayment.extraMonthlyPayment.toFixed(2)))
              : addMonthlyPaymentWithTaxes(monthlyPayment).totalExtraMonthlyPayment}
          </h1>
          {mortgageInsurance > 0 && <Tooltip title={`When you have 22% equity in your home, legally your mortgage insurance will be removed. When your mortgage insurance is removed, your new monthly payment will be ${returnMonthlyPaymentMinusMIP(monthlyPayment,addMonthlyPaymentWithTaxes(monthlyPayment).totalExtraMonthlyPayment)}`} placement="top">
              <p className="cursor-pointer text-[18px] ml-[2px] sm:block hidden">*</p>
            </Tooltip>}
          </div>

          {/*Total Amount Paid with Taxes Extra P */}
          <AnimatePresence>
            {extraPayment > 0 && showTax === "monthlyPaymentWithTax" && (
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1, transition: { duration: 0.2, ease: easeInOut } }}
                exit={{ opacity: [0.8, 0], transition: { duration: 0.1, ease: easeInOut } }}
                className="w-auto flex flex-col mt-2"
              >
                {/* Monthly Payment */}
                <div className="w-auto flex items-center">
                  <div className="w-auto flex items-center">
                    <p className="text-[12.5px]">
                      Extra Monthly Payment - <span className="font-bold">{USDollar.format(Number(monthlyPayment?.extraMonthlyPayment.toFixed(2)))}</span>
                    </p>
                  </div>
                </div>

                {/* Property Tax */}
                <div className="w-auto flex items-center">
                  <div className="w-auto flex items-center">
                    <p className="text-[12.5px]">
                      Property Tax - <span className="font-bold">{USDollar.format(Number(monthlyPayment?.propertyTax.toFixed(2)))}</span>
                    </p>
                  </div>
                </div>

                {/* Mortgage Insurance*/}
                {mortgageInsurance > 0 && (
                  <div className="w-auto flex items-center">
                    <div className="w-auto flex items-center">
                      <p className="text-[12.5px]">
                        Mortgage Insurance- <span className="font-bold">{USDollar.format(Number(monthlyPayment?.mortgageInsurance.toFixed(2)))}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Home Owners Insurance */}
                <div className="w-auto flex items-center">
                  <div className="w-auto flex items-center">
                    <p className="text-[12.5px]">
                      Home Owners Insurance - <span className="font-bold">{USDollar.format(Number(monthlyPayment?.insurance.toFixed(2)))}</span>
                    </p>
                  </div>
                </div>

                {/* Total Taxes */}
                <div className="w-auto flex items-center underline">
                  <div className="w-auto flex items-center">
                    <p className="text-[12.5px]">
                      Total Taxes - <span className="font-bold">{USDollar.format(returnTotalTaxes(monthlyPayment))}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {showTax === "monthlyPaymentWithTax" && <div className="w-auto flex flex-col mb-4">
            <h1 className="text-[12.5px] text-red-400">- When you have 22% equity in your home your mortgage insurance is removed, your new <span className=" font-bold dark:text-darkText text-lightText"> monthly payment will be {returnMonthlyPaymentMinusMIP(monthlyPayment,addMonthlyPaymentWithTaxes(monthlyPayment).totalMonthlyPayment)}</span> and <span className=" font-bold dark:text-darkText text-lightText">extra monthly payment will be {returnMonthlyPaymentMinusMIP(monthlyPayment,addMonthlyPaymentWithTaxes(monthlyPayment).totalExtraMonthlyPayment)}</span></h1>
      </div>}

      {/* Charts Go Here */}
      <div className="w-full h-auto flex flex-col ">
        <div className="flex items-center w-auto h-auto">
          <h1 className={`mr-8 cursor-pointer ${view === "Graph View" ? "underline text-chartGreen font-bold" : "text-gray-400"}`} onClick={() => setView("Graph View")}>
            Graph View
          </h1>
          <h1 className={` cursor-pointer ${view === "Summary View" ? "underline text-chartGreen font-bold" : "text-gray-400"}`} onClick={() => setView("Summary View")}>
            Summary View
          </h1>
        </div>

        <hr className="border my-2 border-gray-300" />

        {view === "Graph View" && (
          <div className="w-full xl:w-[90%] 2xl:w-[70%] h-auto grid grid-cols-1 relative ">
            {regualrLoanAmmortization?.myLoan && monthlyPayment && selectedGoal && (
              <HouseChart
                regualarLoan={regualrLoanAmmortization}
                extraLoan={extraLoanAmmortization}
                monthlyPayment={monthlyPayment}
                extraNumberOfYears={extraNumberOfYears}
                downPayment={selectedGoal.downPayment}
              />
            )}
          </div>
        )}

        {view === "Summary View" && regualrLoanAmmortization?.myLoan && <div className="w-full xl:w-[90%] 2xl:w-[70%] h-auto grid grid-cols-1 overflow-hidden">House summary</div>}
      </div>
    </div>
  );
}
