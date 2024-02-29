import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dispatch, UseSelector } from "../../redux/store";
import { setSelectedGoal } from "../../redux/features/applicationSlice";
import { Divider } from "@mui/material";
export interface IRetirementPageProps {}

interface FutureValue {
  savings: number;
  time: number;
  compound: number;
  //inflation: number;
  age: number;
  //retireAge: number;
  //lifeExpectancy: number;
  monthlyContribution: number;
  //budget: number;
  preRate: number;
  //postRate: number;
}
interface FutureValueWhatYouNeed {
  time: number;
  compound: number;
  inflation: number;
  budget: number;
  postRate: number;
  retireAge:number
}

export default function RetirementPage(props: IRetirementPageProps) {
  // Redux States
  const { selectedGoal } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // Chart State and Summary State
  const [view, setView] = React.useState<string>("Graph View")

  if (!selectedGoal) {
    dispatch(setSelectedGoal(null));
    return null;
  }

  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
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
  };
  const objDataWhatYouNeed:FutureValueWhatYouNeed= {
    time: selectedGoal.age.lifeExpectancy - selectedGoal.age.retireAge,
    budget: selectedGoal.budget,
    postRate: selectedGoal.postRate / 100,
    inflation: selectedGoal.inflation / 100,
    compound: 1,
    retireAge: selectedGoal.age.retireAge
  };

  // Future Value Function ... returns array
  // link explains that investments and loans typically compound monthly ... so all we do is take the nomial rate / coumponding periods === 12
  function futureValueWhatYouHave(obj: FutureValue) {
    let res = [];
    for (let i = 0; i < obj.time; i++) {
      let age = obj.age;

      const amount = obj.savings;
      const time = i + 1;
      const monthlyP = obj.monthlyContribution;
      //const c = obj.compound;
      const months = 12;
      const rate = obj.preRate / months
      //const equivalentPeriodicRate = Math.pow(1 + rate, c / months) - 1;
      const fvOfPv = amount * Math.pow(1 + rate, time * months);
      const top =  (Math.pow(1 + rate, time * 12) - 1)
      const value = monthlyP * (top / rate);
      

      res.push({
        age: age + i,
        value: value + fvOfPv,
      });
    }
    const highestNum = Math.max(...res.map(item => item.value))
    return {
        data:res,
        highestNum: USDollar.format(highestNum)
    }
  }

  function futureValueWhatYouWillNeed(obj:FutureValueWhatYouNeed) {
    let res = [];
    for (let i = 0; i < obj.time; i++) {
      const age = obj.retireAge;
      
      const time = i + 1;
      
      const monthlyP = obj.budget;
      //const c = obj.compound;
      const months = 12;
      const addInflationAndPostRate = obj.postRate + obj.inflation
      
      const rate = addInflationAndPostRate / months;
      //const equivalentPeriodicRate = Math.pow(1 + rate, c / months) - 1;
      
      const toThePowerTop = (Math.pow(1 + rate, (-time)*months))
      const subtractToThePower = 1 - toThePowerTop
      const top =  monthlyP * subtractToThePower
      const value = (top / rate);

      
      res.push({
        age: age + i,
        value: value,
        //price:
      });
    }

    const highestNum = Math.max(...res.map(item => item.value))
    return {
        data:res,
        highestNum: USDollar.format(highestNum)
    }
  }






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
          className="w-full flex flex-col dark:text-homeText text-lightSmallNavBarBg"
        >
          {/* <h1 className='text-[19px] font-semibold'>Retirement savings at age {selectedGoal?.age?.retireAge}</h1> */}
          <h1 className="text-[19px] font-semibold underline">{selectedGoal?.title}</h1>

          {/* Chart Content */}
          <div className="w-full h-full flex flex-col my-5">
          <h1 className='text-[19px] font-semibold'>Retirement savings at age {selectedGoal?.age?.retireAge}</h1>

            {/* Numbers */}
          <div className="w-auto flex items-center my-5">
            {/* What You Have Number */}
            <div>
                <h1 className="mb-2 text-[17px]">What you'll have</h1>
                <h1 className="text-[21px] font-semibold text-lightSmallNavBarBg dark:text-darkSelectedColor">{futureValueWhatYouHave(objData).highestNum}</h1>
            </div>

            <Divider orientation="vertical" flexItem className="border border-gray-300 mx-8"/>

            {/* What You Have Number */}
            <div>
                <h1 className="mb-2 text-[17px]">What you'll need</h1>
                <h1 className="text-[21px] font-semibold text-lightSmallNavBarBg dark:text-darkSelectedColor">{futureValueWhatYouWillNeed(objDataWhatYouNeed).highestNum}</h1>
            </div>
          </div>

            {/* Charts Go Here */}
          <div className="w-full h-auto flex flex-col">
            <div className="flex items-center w-auto h-auto">
                <h1 className={`mr-8 cursor-pointer ${view === "Graph View" ? 'underline' : 'text-gray-400'}`} onClick={()=>setView("Graph View")}>Graph View</h1>
                <h1 className={` cursor-pointer ${view === "Summary View" ? 'underline' : 'text-gray-500'}`} onClick={()=>setView("Summary View")}>Summary View</h1>
            </div>
          </div>


          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
