import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dispatch, UseSelector } from "../../redux/store";
import { setSelectedGoal } from "../../redux/features/applicationSlice";
import { Divider } from "@mui/material";
import RetirementLineChart from "../../components/charts/RetirementLineChart";
export interface IRetirementPageProps {}

interface FutureValue {
  savings: number;
  time: number;
  compound: number;
  inflation: number;
  age: number;
  retireAge: number;
  lifeExpectancy: number;
  monthlyContribution: number;
  budget: number;
  preRate: number;
  postRate: number;
}
interface FutureValueWhatYouNeed {
  time: number;
  compound: number;
  inflation: number;
  budget: number;
  postRate: number;
  retireAge: number;
  age: number;
  lifeExpectancy: number;
}

export default function RetirementPage(props: IRetirementPageProps) {
  // Redux States
  const { selectedGoal } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // Chart State and Summary State
  const [view, setView] = React.useState<string>("Graph View");

  if (!selectedGoal) {
    dispatch(setSelectedGoal(null));
    return null;
  }

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: `USD`,
  });

  // Obj for future value
  const objData: FutureValue = {
    savings: selectedGoal.savings,
    age: selectedGoal.age.currentAge,
    time: selectedGoal.age.retireAge - selectedGoal.age.currentAge,
    monthlyContribution: selectedGoal.monthlyContribution,
    preRate: selectedGoal.preRate / 100,
    compound: 1,
    postRate: selectedGoal.postRate / 100,
    budget: selectedGoal.budget,
    retireAge: selectedGoal.age.retireAge,
    inflation: selectedGoal.inflation / 100,
    lifeExpectancy: selectedGoal.age.lifeExpectancy,
  };
  const objDataWhatYouNeed: FutureValueWhatYouNeed = {
    time: selectedGoal.age.lifeExpectancy - selectedGoal.age.retireAge,
    budget: selectedGoal.budget,
    postRate: selectedGoal.postRate / 100,
    inflation: selectedGoal.inflation / 100,
    compound: 1,
    retireAge: selectedGoal.age.retireAge,
    age: selectedGoal.age.currentAge,
    lifeExpectancy: selectedGoal.age.lifeExpectancy,
  };

  // Future Value Function ... returns array
  // link explains that investments and loans typically compound monthly ... so all we do is take the nomial rate / coumponding periods === 12
  function returnMonthlyWithdraw(obj: FutureValue) {
    let res = [];
    for (let i = 0; i < obj.time; i++) {
      let age = obj.age;

      const amount = obj.savings;
      const time = i + 1;
      const monthlyP = obj.monthlyContribution;
      const months = 12;
      const rate = obj.preRate / months;

      const fvOfPv = amount * Math.pow(1 + rate, time * months);
      const top = Math.pow(1 + rate, time * 12) - 1;
      const value = monthlyP * (top / rate);

      res.push({
        age: age + i,
        value: value + fvOfPv,
      });
    }
    const highestNum = Math.max(...res.map((item) => item.value));

    function returnMonthlyWithdraw() {
      let monthlyWithdraw = 0;
      for (let i = 0; i < obj.lifeExpectancy - obj.retireAge; i++) {
        const time = obj.lifeExpectancy - obj.retireAge;
        const months = 12;
        const addInflationAndPostRate = Math.abs(obj.postRate - obj.inflation);
        const rate = addInflationAndPostRate / months;

        const toThePowerTop = Math.pow(1 + rate, -time * months);
        const top = 1 - toThePowerTop;
        const topDivideBottom = top / rate;

        monthlyWithdraw = highestNum / topDivideBottom;
      }

      return monthlyWithdraw;
    }

    return returnMonthlyWithdraw();
  }
  function futureValueWhatYouHave(obj: FutureValue) {
    let res = [];
    for (let i = 0; i <= obj.time; i++) {

        // Without making sure i > 0 ... the for loop stopped 1 year short ... now its stops at the right retirement age
      if(i > 0){
        let age = obj.age;
      const amount = obj.savings;
      const time = i ;
      const monthlyP = obj.monthlyContribution;
      //const c = obj.compound;
      const months = 12;
      const rate = obj.preRate / months;
      //const equivalentPeriodicRate = Math.pow(1 + rate, c / months) - 1;
      const fvOfPv = amount * Math.pow(1 + rate, time * months);
      const top = Math.pow(1 + rate, time * 12) - 1;
      const value = monthlyP * (top / rate);

      res.push({
        age: age + i,
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

  function getWhatYouNeedFinalPrice(obj: FutureValueWhatYouNeed) {
    let res = [];
    for (let i = 0; i < obj.lifeExpectancy - obj.retireAge; i++) {
      const age = obj.retireAge;

      const time = i + 1;

      const monthlyP = obj.budget;
      
      
      const months = 12;
      const addInflationAndPostRate = (((1 + obj.postRate) / (1 + obj.inflation)) - 1);

      const rate = addInflationAndPostRate / months;
      //const equivalentPeriodicRate = Math.pow(1 + rate, c / months) - 1;

      const toThePowerTop = Math.pow(1 + rate, -time * months);
      const subtractToThePower = 1 - toThePowerTop;
      const top = monthlyP * subtractToThePower;
      const value = top / rate;

      res.push({
        age: age + i,
        value: value,
        
      });
    }

    const highestNum = Math.max(...res.map((item) => item.value));
    return highestNum
  }

  function futureValueWhatYouWillNeed(obj: FutureValueWhatYouNeed) {
    // This function grabs the monthy payment 
    //* We simply solve for PMT
    //Future Value of an Ordinary Annuity
    //* FV = PMT * ((1 + rate/months)^ time * months - 1) / (rate / 12)
    function getMonthlyPayment() {
      let monthlyContribution = 0;
      for (let i = 0; i < obj.retireAge - obj.age; i++) {
        const time = obj.retireAge - obj.age;

        const moneyNeededForBudgetNumber = getWhatYouNeedFinalPrice(obj);
        const addInflationAndPostRate = (((1 + obj.postRate) / (1 + obj.inflation)) - 1);
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
    for (let i = 0; i <= obj.retireAge - obj.age; i++) {
      if(i > 0){
        let age = obj.age;

        const amount = 0;
        const time = i;
        const monthlyP = getMonthlyPayment();
        //const c = obj.compound;
        const months = 12;
        const addInflationAndPostRate = (((1 + obj.postRate) / (1 + obj.inflation)) - 1);
  
        const rate = addInflationAndPostRate / months;
        //const equivalentPeriodicRate = Math.pow(1 + rate, c / months) - 1;
        const fvOfPv = amount * Math.pow(1 + rate, time * months);
        const top = Math.pow(1 + rate, time * 12) - 1;
        const value = monthlyP * (top / rate);
  
        res.push({
          age: age + i,
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

//   console.log(futureValueWhatYouWillNeed(objDataWhatYouNeed), "need");
//   console.log(getWhatYouNeedFinalPrice(objDataWhatYouNeed))

  return (
    <div className="w-full h-full">
      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedGoal ? selectedGoal?.title : "empty"}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full flex flex-col dark:text-gray-300 text-black"
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
                <h1 className="text-[21px] font-semibold text-chartGreen">{futureValueWhatYouHave(objData).highestNum}</h1>
              </div>

              <Divider orientation="vertical" flexItem className="border border-gray-300 mx-8" />

              {/* What You Need Number */}
              <div>
                <h1 className="mb-2 text-[17px] text-lightText dark:text-white font-bold dark:font-normal">What you'll need</h1>
                <h1 className="text-[21px] font-semibold text-chartYellow">{USDollar.format(getWhatYouNeedFinalPrice(objDataWhatYouNeed))}</h1>
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
               <RetirementLineChart need={futureValueWhatYouWillNeed(objDataWhatYouNeed)} have={futureValueWhatYouHave(objData)} /> 
               </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
