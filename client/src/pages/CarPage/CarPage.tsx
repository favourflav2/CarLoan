import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { editSelectedGoalTitle, setSelectedGoal } from "../../redux/features/applicationSlice";
import CarPageInputs from "./CarPageInputs";
import CarChart from "../../components/charts/CarChart";
import { Divider, SelectChangeEvent } from "@mui/material";
import CarPageSummary from "./CarPageSummary";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MonthsSection from "./components/MonthsSection";
import { editCarGoalTitle } from "../../redux/features/modalSlices/carModalSlice";
import EditImgModal from "./components/EditImgModal";
import EditNoteIcon from "@mui/icons-material/EditNote";
import insertCar from "../../assets/addImg.png";
import EditNameAndModal from "./EditNameAndModal";
import useCarFVFunction from "./hooks/useCarFVFunctions";
import { updateCarName } from "../../redux/asyncActions/carActions";
import { LazyLoadImage } from 'react-lazy-load-image-component';

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
  const { selectedGoal, shrinkDashboardSidebar} = UseSelector((state) => state.app);
  const { user } = UseSelector((state) => state.auth);
  const dispatch = Dispatch();

  const userId = user?.userObj.id;

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
  const [updatedImg, setUpdatedImg] = React.useState(""); // eslint-disable-line

  // Modal States
  const [openImgModal, setOpenImgModal] = React.useState(false);

  function updateImg(img: string) {
    setUpdatedImg(img);
  }

  // Chart States with react useMemo
  const { extraLoanAmmortization, extraNumberOfMonths, regualrLoanAmmortization, monthlyPayment } = useCarFVFunction();

  // Edit State and Save Btn
  const [editState, setEditState] = React.useState(false);
  const [saveBtn, setSaveBtn] = React.useState(false);

  // Chart State and Summary State
  const [view, setView] = React.useState<string>("Graph View");

  // Handle Submit
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    if (!selectedGoal || selectedGoal?.type !== "Car") return;

    if (userId) {
      dispatch(editSelectedGoalTitle({ title: data?.name, goal: selectedGoal, modal: data?.modal }));
      dispatch(updateCarName({ id: selectedGoal.id, name: data.name, modal: data.modal }));
      setEditState(false);
      setSaveBtn(false);
    } else {
      dispatch(editCarGoalTitle({ id: selectedGoal.id, name: data?.name, goal: selectedGoal, modal: data?.modal }));

      dispatch(editSelectedGoalTitle({ title: data?.name, goal: selectedGoal, modal: data?.modal }));
      setEditState(false);
      setSaveBtn(false);
    }
  };

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

  // Scroll to top on render
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, [selectedGoal?.id]);

 


  if (!selectedGoal || selectedGoal?.type !== "Car") {
    dispatch(setSelectedGoal(null));
    return null;
  }
  return (
    <div className="w-full h-full flex flex-col min-[900px]:px-0 px-4">
      {/* Top Section Chart and Inputs */}
      <div
        className={`w-full h-full grid ${
          shrinkDashboardSidebar
            ? "lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] min-[880px]:grid-cols-[250px_1fr] grid-cols-1"
            : "lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] grid-cols-1"
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
            <CarPageInputs selectedGoal={selectedGoal} />
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
            {/* Name and Modal Inputs on Edit */}
            <EditNameAndModal
              handleChange={handleChange}
              onSubmit={onSubmit}
              handleSubmit={handleSubmit}
              saveBtn={saveBtn}
              register={register}
              errors={errors}
              allInputData={allInputData}
              setValue={setValue}
              setEditState={setEditState}
              editState={editState}
            />

            {/* Car Box */}
            <div className="w-auto flex flex-col sm:flex-row items-center sm:justify-normal justify-center mb-6 mt-4">
              <div className="w-[220px] h-[220px] flex justify-center items-center  rounded-md relative">
                {/* <img src={selectedGoal.img ? selectedGoal.img : insertCar} alt="" className="w-[200px] h-[200px] rounded-md object-cover" /> */}
                <LazyLoadImage src={selectedGoal.img ? selectedGoal.img : insertCar} alt="carImg" className="w-[200px] h-[200px] rounded-md object-cover" effect="blur"/>

                <button
                  className="h-[30px] w-[30px] absolute right-0 top-0  bg-gray-800 dark:bg-gray-200 dark:text-gray-800 text-white   rounded-full"
                  onClick={() => setOpenImgModal(true)}
                >
                  <EditNoteIcon className=" " />
                </button>
              </div>

              {/* About Car */}
              <div className="w-auto flex flex-col sm:ml-4  mt-3 sm:mt-0">
                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Car Name/Modal:</span> {selectedGoal.modal === "*Other" ? "" : selectedGoal.modal} {selectedGoal.name}
                </h1>
                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Price:</span>{" "}
                  <span className="text-chartYellow font-bold"> {USDollar.format(selectedGoal.price)}</span>
                </h1>
                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Down Payment:</span>{" "}
                  <span className="text-red-500 font-bold"> {USDollar.format(selectedGoal.downPayment)}</span>
                </h1>
                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Miles:</span> {selectedGoal.mileage.toLocaleString()} miles
                </h1>
                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Term:</span> {selectedGoal.term} months
                </h1>
                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Interest Rate:</span> {selectedGoal.interest}%{" "}
                </h1>

                <h1 className="text-[15px]">
                  <span className="font-bold text-[15px]">Loan Amount:</span>{" "}
                  <span className="text-chartGreen font-bold">{USDollar.format(selectedGoal.price - selectedGoal.downPayment)}</span>
                </h1>
              </div>
            </div>

            {/* Chart Content */}
            <div className="w-full h-full flex flex-col my-5">
              <h1 className="text-[19px] font-semibold">Auto Loan </h1>

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
                  <h1
                    className={`mr-8 cursor-pointer ${view === "Graph View" ? "underline text-chartGreen font-bold" : "text-gray-400"}`}
                    onClick={() => setView("Graph View")}
                  >
                    Graph View
                  </h1>
                  <h1
                    className={` cursor-pointer ${view === "Summary View" ? "underline text-chartGreen font-bold" : "text-gray-400"}`}
                    onClick={() => setView("Summary View")}
                  >
                    Summary View
                  </h1>
                </div>

                <hr className="border my-2 border-gray-300" />

                {view === "Graph View" && (
                  <div className="w-full xl:w-[90%] 2xl:w-[70%] h-auto grid grid-cols-1 relative ">
                    {regualrLoanAmmortization?.myLoan && monthlyPayment && selectedGoal && (
                      <CarChart
                        regualarLoan={regualrLoanAmmortization}
                        extraLoan={extraLoanAmmortization}
                        monthlyPayment={monthlyPayment}
                        extraNumberOfMonths={extraNumberOfMonths}
                        downPayment={selectedGoal.downPayment}
                      />
                    )}
                  </div>
                )}

                {view === "Summary View" && regualrLoanAmmortization?.myLoan && (
                  <div className="w-full xl:w-[90%] 2xl:w-[70%] h-auto grid grid-cols-1 overflow-hidden">
                    {monthlyPayment && (
                      <CarPageSummary selectedGoal={selectedGoal} monthlyPayment={monthlyPayment} extraNumberOfMonths={extraNumberOfMonths} />
                    )}
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
