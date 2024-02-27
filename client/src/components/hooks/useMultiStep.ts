import { ReactElement } from "react";
import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { setCurrentStepIndexRedux, setStepLength } from "../../redux/features/applicationSlice";

export function useMultiStepForm(step: ReactElement[]) {
    // Redux States
    const {steps, currentStepIndex} = UseSelector(state => state.app)
    const dispatch = Dispatch()
    

    function next(){
        dispatch(setCurrentStepIndexRedux("next"))
    }

    function back(){
        dispatch(setCurrentStepIndexRedux("back"))
    }

    
    // Wanted to save currentIndex and steps in redux so I can you next and back buttons in any component
    React.useEffect(()=>{
        if(steps !== step.length){
            dispatch(setStepLength(step.length))
        }
    },[steps,step,dispatch])

    return {
        currentStepIndex,
        currentStep: step[currentStepIndex],
        back,
        next,
        
    }
}