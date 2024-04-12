import * as React from "react";
import { AllMonths } from "../../pages/CarPage/CarPageSummary";
import Slider from "react-slick";
import { MonthlyPayment } from "../helperFunctions/loanfunctions/LoanFunction";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import TermCard from "../cards/TermCard";

export interface ITermSliderProps {
  data: AllMonths[];
  monthlyPayment: MonthlyPayment;
}

export default function TermSlider({ data, monthlyPayment }: ITermSliderProps) {
  const { monthlyPayment: currentMonthlyPayment, interestSum: currentInterestSum, totalAmountPaid: currentTotalAmountPaid } = monthlyPayment;
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const [sliderRef, setSliderRef] = React.useState<any>(null);
  return (
    <div className="w-full h-auto  flex items-center justify-center flex-col ">
      <div className="w-full h-auto mb-1  flex justify-center items-center">
        <div className="lg:w-[70%] w-full flex  justify-end ">
          <NavigateBeforeIcon className="text-[30px] mr-1 cursor-pointer" onClick={sliderRef?.slickPrev}/>
          <NavigateNextIcon className="text-[30px] ml-1 cursor-pointer" onClick={sliderRef?.slickNext}/>
        </div>
      </div>

      <Slider {...settings} className="lg:w-[70%] w-full h-auto" ref={setSliderRef}>
        {data?.map((obj: AllMonths, index: number) => (
          <TermCard key={index} currentMonthlyPayment={currentMonthlyPayment} currentInterestSum={currentInterestSum} currentTotalAmountPaid={currentTotalAmountPaid} obj={obj}/>
        ))}
      </Slider>
    </div>
  );
}
