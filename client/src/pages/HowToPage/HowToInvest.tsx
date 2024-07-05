import * as React from "react";
import HowToInvestHeader from "./components/Header/HowToInvestHeader";
import CreatorsSection from "./components/Creator/CreatorsSection";
import { Dispatch, UseSelector } from "../../redux/store";
import { toast } from "react-toastify";
import { setVisitedHowToInvest } from "../../redux/features/applicationSlice";
import Books from "./components/Books/Books";
import BrokeragePage from "./components/Brokerage/BrokeragePage";
import HowToInvestSummary from "./components/Summary/HowToInvestSummary";



export interface IHowToInvestProps {}

export default function HowToInvest(props: IHowToInvestProps) {

  
  const {visitedHowToInvest} = UseSelector(state => state.app)
  const dispatch = Dispatch()

  React.useEffect(()=>{
    if(!visitedHowToInvest){
      toast.warn("If you have ad blockers on, you may encounter some bugs within this page")
      dispatch(setVisitedHowToInvest())
    }
  },[]) // eslint-disable-line
  return (
    <div className="w-full min-h-screen flex flex-col dark:text-darkText text-lightText">
      {/* Container */}
      <div className="w-full h-full flex items-center justify-center flex-col">
        {/* Content */}
        <div className="2xl:w-[75%]  xl:w-[80%] lg:w-[90%] w-full  flex flex-col h-full p-4">

          {/* Header */}
          <HowToInvestHeader />

          {/* Creators */}
          <CreatorsSection />

          {/* Books */}
          <div>
          <Books />
          </div>

          {/* Brokerage Accounts */}
          <BrokeragePage />

          {/* Summary */}
          <HowToInvestSummary />
        </div>
      </div>
    </div>
  );
}
