import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dispatch, UseSelector } from "../../redux/store";
import { editSelectedGoalTitle, setSelectedGoal } from "../../redux/features/applicationSlice";
import { Divider } from "@mui/material";
import RetirementLineChart from "../../components/charts/RetirementLineChart";
import RetirementInputs from "./RetirementInputs";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { editRetireGoalTitle } from "../../redux/features/modalSlices/retirementSlice";
import RetirementSummary from "./RetirementSummary";
import RetirementExplain from "./RetirementExplain";
import futureValueWhatYouHave from "../../components/helperFunctions/futureValueWhatYouHave";
import getWhatYouNeedFinalPrice from "../../components/helperFunctions/getWhatYouNeedFinalPrice";
import futureValueWhatYouWillNeed from "../../components/helperFunctions/futureValueWhatYouWillNeed";
import { getMonthlyPaymentForHave, getMonthlyPaymentForNeed } from "../../components/helperFunctions/getMonthlyPaymentForHave";

interface AgeNum {
  age: number;
  value: number;
}
interface ForLoopData {
  data: Array<AgeNum>;
  highestNum: string;
  highestNumNoFormat: number;
}

const schema = z.object({
  title: z
    .string({
      required_error: "Please enter a title",
    })
    .min(4, {
      message: "Min length is 4",
    })
    .max(18, {
      message: "Max length is 18",
    }),
});

type FormFields = z.infer<typeof schema>;

export default function RetirementPage() {
  // Redux States
  const { selectedGoal, shrinkDashboardSidebar } = UseSelector((state) => state.app);
  const { retireGoals } = UseSelector((state) => state.retireSlice);
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
      title: selectedGoal?.type === "Retirement" && selectedGoal?.title ? selectedGoal?.title : "",
    },
    resolver: zodResolver(schema),
  });

  // Id
  const id = selectedGoal?.id;

  // Edit State
  const [editState, setEditState] = React.useState(false);
  const [saveBtn, setSaveBtn] = React.useState(false);

  // Chart State and Summary State
  const [view, setView] = React.useState<string>("Graph View");

  // Have State
  const [have, setHave] = React.useState<ForLoopData>({
    data: [],
    highestNum: "",
    highestNumNoFormat: 0,
  });

  // Need State
  const [need, setNeed] = React.useState<ForLoopData>({
    data: [],
    highestNum: "",
    highestNumNoFormat: 0,
  });

  // Need Monthly Contribution State
  const [needMonthlyContribution, setNeedMonthlyContribution] = React.useState(0);

  // Have Retirement Budget
  const [haveRetireBudget, setHaveRetireBudget] = React.useState({
    value: 0,
    valueNoInflation: 0,
  });

  // Show State
  const [show, setShow] = React.useState(true);

  // Final Price State
  const [needFinalPrice, setNeedFinalPrice] = React.useState<number>(0);

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: `USD`,
  });

  // Handle Submit
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    dispatch(editRetireGoalTitle({ id, newTitle: data?.title, goal: selectedGoal }));

    dispatch(editSelectedGoalTitle({ title: data?.title, goal: selectedGoal }));
    setEditState(false);
    setSaveBtn(false);
  };

  //* UseEffect here handles all the math needed for charts
  // link explains that investments and loans typically compound monthly ... so all we do is take the nomial rate / coumponding periods === 12
  React.useEffect(() => {
    if (selectedGoal && selectedGoal?.type === "Retirement") {
      setHave(futureValueWhatYouHave(selectedGoal));
      setNeedFinalPrice(getWhatYouNeedFinalPrice(selectedGoal));
      setNeed(futureValueWhatYouWillNeed(selectedGoal));
      setHaveRetireBudget(getMonthlyPaymentForHave(selectedGoal, futureValueWhatYouHave(selectedGoal).highestNumNoFormat));
      setNeedMonthlyContribution(getMonthlyPaymentForNeed(selectedGoal));
    }
  }, [selectedGoal, retireGoals, dispatch]);

  // Makes Sure inputs match selected goal on page refresh
  React.useEffect(() => {
    if (selectedGoal && selectedGoal?.type === "Retirement" && saveBtn === false) {
      reset({
        title: selectedGoal?.title ? selectedGoal?.title : "",
      });
    }
    trigger();
  }, [selectedGoal, reset]); // eslint-disable-line

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  React.useEffect(() => {
    const subscription = watch((data) => {
      if (selectedGoal?.type !== "Retirement") return;
      if (data?.title === selectedGoal?.title) {
        return setSaveBtn(false);
      } else {
        return setSaveBtn(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, saveBtn, selectedGoal]);

  // Function take a string and return upper case at postion [0]
  function upperCaseWords(str: string) {
    const arr = str.split(" ");

    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        arr[i] = arr[i][0].toUpperCase() + arr[i].substring(1);
      }
    }

    if (selectedGoal) {
      return arr.join(" ");
    } else {
      return "";
    }
  }

  // On refresh or selected goal changes set view back to chart
  React.useEffect(() => {
    setView("Graph View");
  }, [selectedGoal]);

  if (!selectedGoal || selectedGoal?.type !== "Retirement") {
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
            key={selectedGoal ? selectedGoal?.title : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-h-[900px]"
          >
            <RetirementInputs />
          </motion.div>
        </AnimatePresence>

        {/* Right Side Chart */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGoal ? selectedGoal?.title : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col dark:text-gray-300 text-black p-4"
          >
            {/* <h1 className='text-[19px] font-semibold'>Retirement savings at age {selectedGoal?.age?.retireAge}</h1> */}
            <div className="w-auto flex flex-col">
              {/* Edit Title Container */}
              <div className="w-auto h-auto flex items-center ">
                {editState ? (
                  <motion.input
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2,
                      ease: [0, 0.71, 0.2, 1.01],
                    }}
                    className="outline-chartGreen dark:outline-none indent-1 h-[30px] text-[16px] border border-gray-300 dark:border-none rounded-md dark:text-black"
                    type="text"
                    {...register("title")}
                  />
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
                    {upperCaseWords(selectedGoal?.title)}{" "}
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
                  >
                    <CloseIcon
                      className="ml-2 text-[22px] cursor-pointer"
                      onClick={() => {
                        setEditState(false);
                        setValue("title", selectedGoal?.title);
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
              {errors?.title && <p className="text-red-500 text-[13px] ">{errors?.title?.message}</p>}

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

            {/* Chart Content */}
            <div className="w-full h-full flex flex-col my-5">
              <h1 className="text-[19px] font-semibold">Retirement savings at age {selectedGoal?.retireAge}</h1>

              {/* Numbers */}
              <div className="w-auto flex md:justify-normal justify-around items-center my-5">
                {/* What You Have Number */}
                <div>
                  <h1 className="mb-2 sm:text-[17px] text-[15px] text-lightText dark:text-white font-bold dark:font-normal">What you'll have</h1>

                  <h1 className="sm:text-[21px] text-[19px] font-semibold text-chartGreen">{have ? have.highestNum : 0}</h1>
                </div>

                <Divider orientation="vertical" flexItem className="border border-gray-300 md:mx-8" />

                {/* What You Need Number */}
                <div>
                  <h1 className="mb-2 sm:text-[17px] text-[15px] text-lightText dark:text-white font-bold dark:font-normal">What you'll need</h1>

                  <h1 className="sm:text-[21px] text-[19px] font-semibold text-chartYellow">{needFinalPrice ? USDollar.format(needFinalPrice) : 0}</h1>
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

                {view === "Graph View" && <div className="w-full xl:w-[90%] 2xl:w-[70%] h-auto grid grid-cols-1 relative ">{need && have && <RetirementLineChart need={need} have={have} />}</div>}

                {view === "Summary View" && (
                  <RetirementSummary show={show} setShow={setShow} have={have} need={need} haveRetireBudget={haveRetireBudget} needMonthlyContribution={needMonthlyContribution} />
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Text Explaining Whats Going on */}
      <RetirementExplain haveHighNum={have.highestNumNoFormat} needFinalPrice={needFinalPrice} />
    </div>
  );
}
