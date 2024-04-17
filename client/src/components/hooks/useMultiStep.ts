import { ReactElement } from "react";
import * as React from "react";

export function useMultiStepForm(step: ReactElement[], steps: number) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  function next() {
    if (currentStepIndex < steps) {
      setCurrentStepIndex((item) => item + 1);
    }
  }

  function back() {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((item) => item - 1);
    }
  }

  return {
    currentStepIndex,
    currentStep: step[currentStepIndex],
    back,
    next,
    steps
  };
}
