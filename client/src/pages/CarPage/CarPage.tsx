import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { editSelectedGoalTitle, setSelectedGoal } from "../../redux/features/applicationSlice";
import {
  MonthlyPayment,
  getMonthlyPayment,
  loanAmmortization,
  loanAmmortizationWithExtraPayment,
  solveForNumberOfMonths,
  LoanAmmortizationType,
  ExtraNumberMonths,
  MyLoanForLoop,
} from "../../components/helperFunctions/loanfunctions/LoanFunction";
import CarPageInputs from "./CarPageInputs";
import CarHouseChart from "../../components/charts/CarHouseChart";
import { Divider, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import CarPageSummary from "./CarPageSummary";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { carsArr } from "../../components/multiStepDivs/carDivs/CarComponets/carModalSchema";
import MonthsSection from "./components/MonthsSection";
import { editCarGoalTitle } from "../../redux/features/modalSlices/carModalSlice";
import EditImgModal from "./components/EditImgModal";
import EditNoteIcon from "@mui/icons-material/EditNote";

const schema = z.object({
  name: z
    .string({
      required_error: "Please enter a name",
    })
    .max(50, {
      message: "Max length is 50",
    })
    .min(4, {
      message: "Min length is 4",
    }),
  modal: z
    .string({
      required_error: "Please enter a modal",
    })
    .max(50, {
      message: "Max length is 50",
    })
    .min(1, {
      message: "Min length is 1",
    }),
  img: z.any().optional(),
});

type FormFields = z.infer<typeof schema>;

export const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: `USD`,
});

export default function CarPage() {
  // Redux States
  const { selectedGoal, shrinkDashboardSidebar } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // Form Feilds
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<FormFields>({
    mode: "onChange",
    defaultValues: {
      name: selectedGoal?.type === "Car" && selectedGoal?.name ? selectedGoal?.name : "",
      modal: selectedGoal?.type === "Car" && selectedGoal?.modal ? selectedGoal?.modal : "",
      img: selectedGoal?.type === "Car" && selectedGoal?.img ? selectedGoal?.img : "",
    },
    resolver: zodResolver(schema),
  });

  const allInputData = watch();

  // Handle Change
  const handleChange = (event: SelectChangeEvent) => {
    setValue("modal", event.target.value as string);
  };

  // File Uploader
  const [updatedImg, setUpdatedImg] = React.useState("");

  // Modal States
  const [openImgModal, setOpenImgModal] = React.useState(false);

  function updateImg(img: string) {
    setUpdatedImg(img);
  }

  // Chart States
  const [monthlyPayment, setMonthlyPayment] = React.useState<MonthlyPayment>();
  const [regualrLoanAmmortization, setRegualrLoanAmmortization] = React.useState<LoanAmmortizationType>();
  const [extraNumberOfMonths, setExtraNumberOfMonths] = React.useState<ExtraNumberMonths>();
  const [extraLoanAmmortization, setExtraLoanAmmortization] = React.useState<Array<MyLoanForLoop>>();

  // Edit State
  const [editState, setEditState] = React.useState(false);
  const [saveBtn, setSaveBtn] = React.useState(false);

  // Chart State and Summary State
  const [view, setView] = React.useState<string>("Graph View");

  // Handle Submit
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    if (!selectedGoal || selectedGoal?.type !== "Car") return;
    dispatch(editCarGoalTitle({ id: selectedGoal.id, name: data?.name, goal: selectedGoal, modal: data?.modal }));

    dispatch(editSelectedGoalTitle({ title: data?.name, goal: selectedGoal, modal: data?.modal }));
    setEditState(false);
    setSaveBtn(false);
  };

  React.useEffect(() => {
    if (!selectedGoal || selectedGoal.type !== "Car") return;
    setMonthlyPayment(getMonthlyPayment({ rate: selectedGoal.interest, time: selectedGoal.term, downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price }, selectedGoal.extraPayment));
    setExtraNumberOfMonths(
      solveForNumberOfMonths({ rate: selectedGoal.interest, time: selectedGoal.term, downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price }, selectedGoal.extraPayment)
    );
    setRegualrLoanAmmortization(loanAmmortization({ rate: selectedGoal.interest, time: selectedGoal.term, downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price }));
    setExtraLoanAmmortization(
      loanAmmortizationWithExtraPayment({ rate: selectedGoal.interest, time: selectedGoal.term, downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price }, selectedGoal.extraPayment)
    );
  }, [selectedGoal]);

  // Makes Sure inputs match selected goal on page refresh
  React.useEffect(() => {
    if (selectedGoal && selectedGoal?.type === "Car" && saveBtn === false) {
      reset({
        name: selectedGoal?.name ? selectedGoal?.name : "",
        modal: selectedGoal?.modal ? selectedGoal?.modal : "",
        img: selectedGoal?.type === "Car" && selectedGoal?.img ? selectedGoal?.img : "",
      });
    }
    trigger();
  }, [selectedGoal, reset]); // eslint-disable-line

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  React.useEffect(() => {
    const subscription = watch((data) => {
      if (selectedGoal?.type !== "Car") return;
      if (data?.modal !== selectedGoal?.modal || data?.name !== selectedGoal?.name) {
        setSaveBtn(true);
      } else {
        setSaveBtn(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, saveBtn, selectedGoal]);

  if (!selectedGoal || selectedGoal?.type !== "Car") {
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
            key={selectedGoal ? selectedGoal?.name : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-h-[900px]"
          >
            <CarPageInputs />
          </motion.div>
        </AnimatePresence>

        {/* Right Side Chart */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGoal ? selectedGoal?.name : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col dark:text-gray-300 text-black p-4"
          >
            <div className="w-auto flex flex-col">
              {/* Edit Title Container */}
              <div className="w-auto h-auto flex  relative">
                {editState ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2,
                      ease: [0, 0.71, 0.2, 1.01],
                    }}
                    className="w-auto flex flex-col mb-4"
                  >
                    {/* Modal Select */}
                    <div className="w-auto flex flex-col mb-2">
                      <label htmlFor="modal" className="text-[12px]">
                        Modal
                      </label>
                      <Select
                        label="Modal"
                        MenuProps={{ PaperProps: { sx: { maxHeight: 150 } } }}
                        sx={{
                          boxShadow: "none",
                          ".MuiOutlinedInput-notchedOutline": { border: 0 },
                          "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                            border: 0,
                          },
                          "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: 0,
                          },
                        }}
                        className="outline-none h-[30px] text-[16px] border border-gray-300 dark:border-none rounded-md dark:text-black bg-white"
                        onChange={handleChange}
                        value={allInputData.modal}
                      >
                        {carsArr.map((item: string, index: number) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>

                    {/* Car Name */}
                    <div className="w-auto flex flex-col">
                      <label htmlFor="name" className="text-[12px]">
                        Name
                      </label>
                      <input
                        className="outline-chartGreen dark:outline-none indent-4 h-[30px] text-[16px] border border-gray-300 dark:border-none rounded-md dark:text-black"
                        type="text"
                        {...register("name")}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.h1
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2,
                      ease: [0, 0.71, 0.2, 1.01],
                    }}
                    className="text-[19px] font-semibold underline inline-block align-bottom"
                  >
                    {selectedGoal.modal} {selectedGoal.name}
                  </motion.h1>
                )}

                {editState ? (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2,
                      ease: [0, 0.71, 0.2, 1.01],
                    }}
                    className=" absolute left-[180px]"
                  >
                    <CloseIcon
                      className="ml-2 text-[22px] cursor-pointer"
                      onClick={() => {
                        setEditState(false);
                        setValue("name", selectedGoal?.name);
                        setValue("modal",selectedGoal.modal)
                      }}
                    />
                  </motion.button>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2,
                      ease: [0, 0.71, 0.2, 1.01],
                    }}
                  >
                    <EditIcon className="ml-2 text-[22px] cursor-pointer" onClick={() => setEditState(true)} />
                  </motion.button>
                )}
              </div>
              {errors?.name && <p className="text-red-500 text-[13px] ">{errors?.name?.message}</p>}

              {/* Save Button */}
              <AnimatePresence>
                {saveBtn && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 0.97 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.2,
                      ease: [0, 0.71, 0.2, 1.01],
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="w-[100px] text-[14px] mt-2 rounded-lg border-2 border-chartGreen dark:text-white text-black"
                    onClick={handleSubmit(onSubmit)}
                  >
                    Save
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Car Box */}
            <div className="w-auto flex flex-col sm:flex-row items-center sm:justify-normal justify-center mb-6 mt-4">
              <div className="w-[220px] h-[220px] flex justify-center items-center  rounded-md relative">
                <img src={selectedGoal.img} alt="" className="w-[200px] h-[200px] rounded-md" />
               
                <button className="h-[30px] w-[30px] absolute right-0 top-0  bg-gray-800 dark:bg-gray-200 dark:text-gray-800 text-white   rounded-full" onClick={()=> setOpenImgModal(true)}><EditNoteIcon className=" " /></button>
              </div>

              {/* About Car */}
              <div className="w-auto flex flex-col sm:ml-4  mt-3 sm:mt-0">
                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Car Name/Modal:</span> {selectedGoal.modal} {selectedGoal.name}
                </h1>
                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Price:</span> <span className="text-chartYellow font-bold"> {USDollar.format(selectedGoal.price)}</span>
                </h1>
                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Down Payment:</span> <span className="text-red-500 font-bold"> {USDollar.format(selectedGoal.downPayment)}</span>
                </h1>
                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Miles:</span> {selectedGoal.mileage.toLocaleString()} miles
                </h1>
                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Income:</span> {USDollar.format(selectedGoal.salary)}
                </h1>
                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Term:</span> {selectedGoal.term} months
                </h1>
                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Interest Rate:</span> {selectedGoal.interest}%{" "}
                </h1>

                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Loan Amount:</span> <span className="text-chartGreen font-bold">{USDollar.format(selectedGoal.price - selectedGoal.downPayment)}</span>
                </h1>
              </div>
            </div>

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
                    {regualrLoanAmmortization?.myLoan && extraLoanAmmortization && monthlyPayment && extraNumberOfMonths && selectedGoal && (
                      <CarHouseChart
                        regualarLoan={regualrLoanAmmortization}
                        extraLoan={extraLoanAmmortization}
                        type="Car"
                        monthlyPayment={monthlyPayment}
                        extraNumberOfMonths={extraNumberOfMonths}
                        downPayment={selectedGoal.downPayment}
                      />
                    )}
                  </div>
                )}

                {view === "Summary View" && regualrLoanAmmortization?.myLoan && extraLoanAmmortization && (
                  <div className="w-full xl:w-[90%] 2xl:w-[70%] h-auto grid grid-cols-1 overflow-hidden">
                    <CarPageSummary selectedGoal={selectedGoal} monthlyPayment={monthlyPayment} extraNumberOfMonths={extraNumberOfMonths} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* In summary page we show all the terms and thier loan amount */}
      {selectedGoal && monthlyPayment && view === "Summary View" && <MonthsSection monthlyPayment={monthlyPayment} selectedGoal={selectedGoal} />}

      <EditImgModal updateImg={updateImg} setOpenImgModal={setOpenImgModal} open={openImgModal} />
    </div>
  );
}
