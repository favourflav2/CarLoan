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
import { editRetireGoalTitle } from "../../redux/features/retirementSlice";
import RetirementSummary from "./RetirementSummary";
import RetirementExplain from "./RetirementExplain";
import MenuIcon from "@mui/icons-material/Menu";

interface SelectedGoalType {
  type: string;
  id: string;
  age: {
    currentAge: number;
    retireAge: number;
    lifeExpectancy: number;
  };
  savings: number;
  monthlyContribution: number;
  budget: number;
  preRate: number;
  postRate: number;
  inflation: number;
  title: string;
}

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
      title: selectedGoal?.title ? selectedGoal?.title : "",
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
    dispatch(editRetireGoalTitle({ name: "title", id, value: data?.title }));
    dispatch(editSelectedGoalTitle({ name: "title", value: data?.title, goal: selectedGoal }));
    setEditState(false);
    setSaveBtn(false);
  };

  // Future Value Function ... returns array
  // link explains that investments and loans typically compound monthly ... so all we do is take the nomial rate / coumponding periods === 12
  React.useEffect(() => {
    // Put my foor loops in a useEffect ... my data was getting ran too much outside of it
    function futureValueWhatYouHave(obj: SelectedGoalType) {
      const {
        age: { currentAge, retireAge },
        savings,
        monthlyContribution,
        preRate,
      } = obj;

      const newPreRate = preRate / 100;
      let res = [];
      for (let i = 0; i <= retireAge - currentAge; i++) {
        //Without making sure i > 0 ... the for loop stopped 1 year short ... now its stops at the right retirement age
        if (i > 0) {
          let age = currentAge;
          const amount = savings;
          const time = i;
          const monthlyP = monthlyContribution;

          const months = 12;
          const rate = newPreRate / months;
          //const c = obj.compound;
          //const equivalentPeriodicRate = Math.pow(1 + rate, c / months) - 1;
          const fvOfPv = amount * Math.pow(1 + rate, time * months);

          const top = Math.pow(1 + rate, time * 12) - 1;
          //console.log(top)
          const value = monthlyP * (top / rate);

          res.push({
            age: i === 1 ? currentAge : age + i,
            value: value + fvOfPv,
          });
        }
      }
      const highestNum = Math.max(...res.map((item) => item.value));

      return {
        data: res,
        highestNum: USDollar.format(highestNum),
        highestNumNoFormat: highestNum,
      };
    }

    function getWhatYouNeedFinalPrice(obj: SelectedGoalType) {
      const {
        age: { retireAge, lifeExpectancy },
        budget,
        postRate,
        inflation,
      } = obj;
      const newPostRate = postRate / 100;
      const newInflation = inflation / 100;
      let res = [];
      for (let i = 0; i < lifeExpectancy - retireAge; i++) {
        const age = retireAge;

        const time = i + 1;

        const monthlyP = budget;

        const months = 12;
        const addInflationAndPostRate = (1 + newPostRate) / (1 + newInflation) - 1;

        const rate = addInflationAndPostRate / months;
        //const equivalentPeriodicRate = Math.pow(1 + rate, c / months) - 1;

        const toThePowerTop = Math.pow(1 + rate, -time * months);
        const subtractToThePower = 1 - toThePowerTop;
        const top = monthlyP * subtractToThePower;
        const value = top / rate;

        // if inflation and postRate === each ohter it means we have a nomial rate of 0
        const yearlyDeposit = monthlyP * 12;
        //console.log(yearlyDeposit)
        const rateOfZero = yearlyDeposit * time;

        res.push({
          age: age + i,
          value: newInflation === newPostRate ? rateOfZero : value,
        });
      }

      const highestNum = Math.max(...res.map((item) => item.value));
      return highestNum;
    }

    function futureValueWhatYouWillNeed(obj: SelectedGoalType) {
      const {
        age: { currentAge, retireAge },

        postRate,
        inflation,
      } = obj;
      const newPostRate = postRate / 100;
      const newInflation = inflation / 100;
      // This function grabs the monthy payment ... becasue I need it in the foor loop below to create my what you need chart
      //* We simply solve for PMT
      //Future Value of an Ordinary Annuity
      //* FV = PMT * ((1 + rate/months)^ time * months - 1) / (rate / 12)
      function getMonthlyPayment() {
        let monthlyContribution = 0;
        for (let i = 0; i < retireAge - currentAge; i++) {
          const time = retireAge - currentAge;

          const moneyNeededForBudgetNumber = getWhatYouNeedFinalPrice(obj);
          const addInflationAndPostRate = (1 + newPostRate) / (1 + newInflation) - 1;
          //console.log(addInflationAndPostRate)
          const months = 12;
          const rate = addInflationAndPostRate / months;

          const toThePowerTop = Math.pow(1 + rate, time * months) - 1;
          const topAndBottom = toThePowerTop / rate;

          const PMT = moneyNeededForBudgetNumber / topAndBottom;

          // if inflation and postRate === each ohter it means we have a nomial rate of 0
          const numberOfPayments = time * months;
          const pmtZeroInterest = moneyNeededForBudgetNumber / numberOfPayments;

          monthlyContribution = newInflation === newPostRate ? pmtZeroInterest : PMT;
        }
        return monthlyContribution;
      }

      // Here we take the retire age - age to get the length
      //* and just loop ... each loop/year is the future value of the concsective year and it keeps getting bigger as the years increase
      // Future Value of a Savings Annuity = PV(1 + (rate/months))^ time * months + (PMT * PMT * ((1 + rate/months)^ time * months - 1) / (rate / 12))
      let res = [];
      for (let i = 0; i <= retireAge - currentAge; i++) {
        if (i > 0) {
          let age = currentAge;

          const amount = 0;
          const time = i;
          const monthlyP = getMonthlyPayment();
          //const c = obj.compound;
          const months = 12;
          const addInflationAndPostRate = (1 + newPostRate) / (1 + newInflation) - 1;

          const rate = addInflationAndPostRate / months;
          //const equivalentPeriodicRate = Math.pow(1 + rate, c / months) - 1;
          const fvOfPv = amount * Math.pow(1 + rate, time * months);
          const top = Math.pow(1 + rate, time * 12) - 1;
          const value = monthlyP * (top / rate);

          // if inflation and postRate === each ohter it means we have a nomial rate of 0
          const yearlyDeposit = monthlyP * 12;
          const rateOfZero = yearlyDeposit * time;

          res.push({
            age: i === 1 ? currentAge : age + i,
            value: newInflation === newPostRate ? rateOfZero : value + fvOfPv,
          });
        }
      }
      const highestNum = Math.max(...res.map((item) => item.value));

      return {
        data: res,
        highestNum: USDollar.format(highestNum),
        highestNumNoFormat: highestNum,
      };
    }

    // Payout Annutiy Function is being used with inflation to calculate monthly withdraw
    function getMonthlyPaymentHave(obj: SelectedGoalType, highNum: number) {
      const {
        age: { retireAge, lifeExpectancy },

        postRate,
        inflation,
      } = obj;
      const newPostRate = postRate / 100;
      const newInflation = inflation / 100;

      const time = lifeExpectancy - retireAge;

      const finalPrice = highNum;
      const addInflationAndPostRate = (1 + newPostRate) / (1 + newInflation) - 1;
      //console.log(addInflationAndPostRate)
      const months = 12;
      const rate = addInflationAndPostRate / months;

      const toThePowerTop = Math.pow(1 + rate, -time * months);
      const subtractToThePower = 1 - toThePowerTop;
      const topDivideBottom = subtractToThePower / rate;
      const value = finalPrice / topDivideBottom;

      // This for PMT with not adjusted with infaltion
      const rateNoInflation = newPostRate / months;

      const toThePowerTopNoInflation = Math.pow(1 + rateNoInflation, -time * months);
      const subtractToThePowerNoInflation = 1 - toThePowerTopNoInflation;
      const topDivideBottomNoInflation = subtractToThePowerNoInflation / rateNoInflation;
      const valueNoInflation = finalPrice / topDivideBottomNoInflation;

      // if inflation and postRate === each ohter it means we have a nomial rate of 0
      const numberOfPayments = time * months;
      const pmtZeroInterest = finalPrice / numberOfPayments;

      return {
        value: newInflation === newPostRate ? pmtZeroInterest : value,
        valueNoInflation,
      };
    }

    // Payout Annutiy for getting montly contribution for what you need final price
    function getMonthlyPaymentNeed(obj: SelectedGoalType) {
      let monthlyContribution = 0;
      const {
        age: { retireAge, currentAge },

        postRate,
        inflation,
      } = obj;
      const newPostRate = postRate / 100;
      const newInflation = inflation / 100;

      const time = retireAge - currentAge;

      const moneyNeededForBudgetNumber = getWhatYouNeedFinalPrice(obj);
      const addInflationAndPostRate = (1 + newPostRate) / (1 + newInflation) - 1;

      const months = 12;
      const rate = addInflationAndPostRate / months;

      const toThePowerTop = Math.pow(1 + rate, time * months) - 1;
      const topAndBottom = toThePowerTop / rate;

      const PMT = moneyNeededForBudgetNumber / topAndBottom;

      // if inflation and postRate === each ohter it means we have a nomial rate of 0
      const numberOfPayments = time * months;
      const pmtZeroInterest = moneyNeededForBudgetNumber / numberOfPayments;

      monthlyContribution = newInflation === newPostRate ? pmtZeroInterest : PMT;

      return monthlyContribution;
    }

    if (selectedGoal) {
      setHave(futureValueWhatYouHave(selectedGoal));
      setNeedFinalPrice(getWhatYouNeedFinalPrice(selectedGoal));
      setNeed(futureValueWhatYouWillNeed(selectedGoal));
      setHaveRetireBudget(getMonthlyPaymentHave(selectedGoal, futureValueWhatYouHave(selectedGoal).highestNumNoFormat));
      setNeedMonthlyContribution(getMonthlyPaymentNeed(selectedGoal));
    }
  }, [selectedGoal, retireGoals, dispatch]); // eslint-disable-line

  // Makes Sure inputs match selected goal on page refresh
  React.useEffect(() => {
    if (selectedGoal && saveBtn === false) {
      reset({
        title: selectedGoal?.title ? selectedGoal?.title : "",
      });
    }
    trigger();
  }, [selectedGoal, reset]); // eslint-disable-line

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  React.useEffect(() => {
    const subscription = watch((data) => {
      if (data?.title === selectedGoal?.title) {
        setSaveBtn(false);
      } else {
        setSaveBtn(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, saveBtn, selectedGoal?.title]);

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

  if (!selectedGoal) {
    dispatch(setSelectedGoal(null));
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col min-[900px]:px-0 px-4">
      <div className=" min-[900px]:hidden block my-3 ">
        <MenuIcon className=" " />
      </div>
      {/* Top Section Chart and Inputs */}
      <div
        className={`w-full h-full grid ${
          shrinkDashboardSidebar ? "lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] min-[880px]:grid-cols-[250px_1fr] grid-cols-1" : "lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] grid-cols-1"
        }`}
      >
        {/* Left Side Inputs */}
        <RetirementInputs />
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
                    {...register("title", {})}
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
              <h1 className="text-[19px] font-semibold">Retirement savings at age {selectedGoal?.age?.retireAge}</h1>

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
