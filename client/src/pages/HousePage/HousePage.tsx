import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { editShowTaxForHouse, setSelectedGoal } from "../../redux/features/applicationSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import HousePageInputs from "./HousePageInputs";
import EditNameHouseBox from "./EditNameHouseBox";
import HouseImgAndNum from "./HouseImgAndNum";
import {
  ExtraNumberYears,
  HouseMonthlyPayment,
  getMonthlyPaymentForHouse,
  loanAmmortizationForHouse,
  loanAmmortizationWithExtraPaymentForHouse,
  solveForNumberOfMonthsForHouse,
} from "../../components/helperFunctions/loanfunctions/HouseLoanFuntion";
import { updateShowTax } from "../../redux/features/modalSlices/houseSlice";
import {  LoanAmmortizationType, MyLoanForLoop } from "../../components/helperFunctions/loanfunctions/LoanFunction";
import { USDollar } from "../CarPage/CarPage";
import { Divider } from "@mui/material";
import HouseChart from "../../components/charts/HouseChart";

export interface IHousePageProps {}

const schema = z.object({
  streetAddress: z
    .string({
      required_error: "Please enter a name",
    })
    .max(50, {
      message: "Max length is 50",
    })
    .min(4, {
      message: "Min length is 4",
    }),
});

type FormFields = z.infer<typeof schema>;

export default function HousePage(props: IHousePageProps) {
  // Redux States
  const { selectedGoal, shrinkDashboardSidebar } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // Form Feilds
  const {
    register,
    handleSubmit,
    setValue,
    // watch,
    // reset,
    // trigger,
    formState: { errors },
  } = useForm<FormFields>({
    mode: "onChange",
    defaultValues: {
      streetAddress: selectedGoal && selectedGoal.type === "House" ? selectedGoal.streetAddress : "",
    },
    resolver: zodResolver(schema),
  });

  // Edit State
  const [editState, setEditState] = React.useState(false);
  const [saveBtn, setSaveBtn] = React.useState(false);

  // Modal States
  const [openImgModal, setOpenImgModal] = React.useState(false);

  // Chart State and Summary State
  const [view, setView] = React.useState<string>("Graph View");

  // Chart States
  const [monthlyPayment, setMonthlyPayment] = React.useState<HouseMonthlyPayment>();
  const [regualrLoanAmmortization, setRegualrLoanAmmortization] = React.useState<LoanAmmortizationType>();
  const [extraNumberOfYears, setExtraNumberOfYears] = React.useState<ExtraNumberYears>();
  const [extraLoanAmmortization, setExtraLoanAmmortization] = React.useState<Array<MyLoanForLoop>>();



  React.useEffect(() => {
    if (!selectedGoal || selectedGoal.type !== "House") return;
    const { interest, downPayment, insurance, mortgageInsurance, propertyTax, price, term } = selectedGoal;
    const twentyPercentValue = price * 0.2;
    const isNotGreaterThan20 = downPayment < twentyPercentValue ? true : false;
    setMonthlyPayment(getMonthlyPaymentForHouse({ rate: interest, time: term, downPayment, price, propertyTax, insurance, mortgageInsurance }, selectedGoal.extraPayment, isNotGreaterThan20));
    setRegualrLoanAmmortization(loanAmmortizationForHouse({ rate: interest, time: term, downPayment, price, propertyTax, insurance, mortgageInsurance }, isNotGreaterThan20));
    setExtraNumberOfYears(solveForNumberOfMonthsForHouse({ rate: interest, time: term, downPayment, price, propertyTax, insurance, mortgageInsurance }, selectedGoal.extraPayment, isNotGreaterThan20));
    setExtraLoanAmmortization(
      loanAmmortizationWithExtraPaymentForHouse({ rate: interest, time: term, downPayment, price, propertyTax, insurance, mortgageInsurance }, selectedGoal.extraPayment, isNotGreaterThan20)
    );
  }, [selectedGoal]);

  // Handle Submit
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    // dispatch(editRetireGoalTitle({ id, newTitle: data?.title, goal: selectedGoal }));
    // dispatch(editSelectedGoalTitle({ title: data?.title, goal: selectedGoal }));
    // setEditState(false);
    // setSaveBtn(false);
  };

 



  if (!selectedGoal || selectedGoal.type !== "House") {
    dispatch(setSelectedGoal(null));
    return null;
  }
  return (
    <div className="w-full h-full flex flex-col min-[900px]:px-0 px-4">
      {/* Top Section Chart and Inputs */}
      <div
        className={`w-full h-full grid ${
          shrinkDashboardSidebar ? "lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] min-[880px]:grid-cols-[250px_1fr] grid-cols-1" : "lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] grid-cols-1"
        }`}
      >
        {/* Left Side Inputs */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGoal ? selectedGoal?.streetAddress : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-h-[900px]"
          >
            <HousePageInputs />
          </motion.div>
        </AnimatePresence>

        {/* Right Side Chart */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGoal ? selectedGoal?.streetAddress : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col dark:text-gray-300 text-black p-4"
          >
            {/* Street Address / Title */}
            <EditNameHouseBox
              register={register}
              onSubmit={onSubmit}
              setValue={setValue}
              editState={editState}
              setEditState={setEditState}
              handleSubmit={handleSubmit}
              saveBtn={saveBtn}
              errors={errors}
            />

            {/* House Img and Numbers */}
            <HouseImgAndNum selectedGoal={selectedGoal} setOpenImgModal={setOpenImgModal} />

            {/* Chart Content */}
            <div className="w-full h-full flex flex-col my-5">
              <h1 className="text-[19px] font-semibold">Retirement savings at age </h1>

              {/* Numbers */}
              <div className="w-auto flex md:justify-normal justify-around items-center my-5">
                {/* What You Have Number */}
                <div>
                  <h1 className="mb-2 sm:text-[17px] text-[15px] text-lightText dark:text-white font-bold dark:font-normal">Monthly Payment</h1>

                  <h1 className="sm:text-[21px] text-[19px] font-semibold text-chartGreen">
                    {monthlyPayment?.monthlyPayment ? USDollar.format(Number(monthlyPayment.monthlyPayment.toFixed(2))) : "-"}
                  </h1>
                </div>

                <Divider orientation="vertical" flexItem className="border border-gray-300 md:mx-8" />

                {/* What You Need Number */}
                <div>
                  <h1 className="mb-2 sm:text-[17px] text-[15px] text-lightText dark:text-white font-bold dark:font-normal">Extra Monthly Payment</h1>

                  <h1 className="sm:text-[21px] text-[19px] font-semibold text-chartYellow">
                    {selectedGoal?.extraPayment === 0 ? "-" : USDollar.format(Number(monthlyPayment?.extraMonthlyPayment.toFixed(2)))}
                  </h1>
                </div>
              </div>

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
                    {regualrLoanAmmortization?.myLoan  && monthlyPayment && selectedGoal && (
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

                {view === "Summary View" && regualrLoanAmmortization?.myLoan  && (
                  <div className="w-full xl:w-[90%] 2xl:w-[70%] h-auto grid grid-cols-1 overflow-hidden">House summary</div>
                )}
              </div>
            </div>

            <button
              className="bg-purple-400 p-2 rounded-lg"
              onClick={() => {
                dispatch(editShowTaxForHouse(selectedGoal));
                dispatch(updateShowTax({ id: selectedGoal.id }));
              }}
            >
              Currently: {selectedGoal.showTax}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
