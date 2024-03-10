import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dispatch, UseSelector } from "../../redux/store";
import { setSelectedGoal } from "../../redux/features/applicationSlice";
import { Divider } from "@mui/material";
import RetirementLineChart from "../../components/charts/RetirementLineChart";
import RetirementInputs from "./RetirementInputs";
export interface IRetirementPageProps {}

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
}

export default function RetirementPage(props: IRetirementPageProps) {
  // Redux States
  const { selectedGoal } = UseSelector((state) => state.app);
  const { retireGoals } = UseSelector((state) => state.retireSlice);
  const dispatch = Dispatch();

  // Chart State and Summary State
  const [view, setView] = React.useState<string>("Graph View");

  // Have State
  const [have, setHave] = React.useState<ForLoopData>({
    data: [],
    highestNum: "",
  });

  const [need, setNeed] = React.useState<ForLoopData>({
    data: [],
    highestNum: "",
  });

  const [needFinalPrice, setNeedFinalPrice] = React.useState<number>(0);

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: `USD`,
  });

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
      // This function grabs the monthy payment
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

          monthlyContribution = PMT;
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
      };
    }
    if (selectedGoal) {
      setHave(futureValueWhatYouHave(selectedGoal));
      setNeedFinalPrice(getWhatYouNeedFinalPrice(selectedGoal));
      setNeed(futureValueWhatYouWillNeed(selectedGoal));
    }
    
  }, [selectedGoal, retireGoals, dispatch]); // eslint-disable-line

  if (!selectedGoal) {
    dispatch(setSelectedGoal(null));
    return null;
  }

  return (
    <div className="w-full h-full grid lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] grid-cols-1">
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
          <h1 className="text-[19px] font-semibold underline">{selectedGoal?.title}</h1>

          {/* Chart Content */}
          <div className="w-full h-full flex flex-col my-5">
            <h1 className="text-[19px] font-semibold">Retirement savings at age {selectedGoal?.age?.retireAge}</h1>

            {/* Numbers */}
            <div className="w-auto flex items-center my-5">
              {/* What You Have Number */}
              <div>
                <h1 className="mb-2 text-[17px] text-lightText dark:text-white font-bold dark:font-normal">What you'll have</h1>

                <h1 className="text-[21px] font-semibold text-chartGreen">{have? have.highestNum : 0}</h1>
              </div>

              <Divider orientation="vertical" flexItem className="border border-gray-300 mx-8" />

              {/* What You Need Number */}
              <div>
                <h1 className="mb-2 text-[17px] text-lightText dark:text-white font-bold dark:font-normal">What you'll need</h1>

                <h1 className="text-[21px] font-semibold text-chartYellow">{needFinalPrice ? USDollar.format(needFinalPrice) : 0}</h1>
              </div>
            </div>

            {/* Charts Go Here */}
            <div className="w-full h-auto flex flex-col ">
              <div className="flex items-center w-auto h-auto">
                <h1 className={`mr-8 cursor-pointer ${view === "Graph View" ? "underline" : "text-gray-400"}`} onClick={() => setView("Graph View")}>
                  Graph View
                </h1>
                <h1 className={` cursor-pointer ${view === "Summary View" ? "underline" : "text-gray-500"}`} onClick={() => setView("Summary View")}>
                  Summary View
                </h1>
              </div>

              <div className="w-full h-auto grid grid-cols-1 relative ">
                {need && have && <RetirementLineChart need={need} have={have} />}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
