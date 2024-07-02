import * as React from "react";
import Slider from "react-slick";
import balanceImg from "../../../../../assets/vangaurdBalance.png";
import portfolioImg from "../../../../../assets/vanguardPortfolioWatch.png";
import retireImg from "../../../../../assets/vanguardRetire.png";
import iphone from "../../../../../assets/vangaurdPhone1.png";
import buy from "../../../../../assets/vanguardBuy.png";
import profile from "../../../../../assets/vanguardProfile.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useSliderFunctions from "./utils/useSliderFunctions";

export interface IBrokerageSliderProps {}

export default function BrokerageSlider(props: IBrokerageSliderProps) {
  const [index, setIndex] = React.useState(0);
  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (oldIndex: number, newIndex: number) => {
      switch (newIndex) {
        case 0:
          setIndex(0);
          break;
        case 1:
          setIndex(1);
          break;
        case 2:
          setIndex(2);
          break;
        case 3:
          setIndex(3);
          break;
        case 4:
          setIndex(4);
          break;
        case 5:
          setIndex(5);
          break;
        default:
          return;
      }
    },
  };

  const {indexSwitch} = useSliderFunctions({index})

  const arr = React.useMemo(() => {
    return [balanceImg, portfolioImg, retireImg, buy, profile, iphone];
  }, []);

  // Next and Back Slider Buttons
  const [sliderRef, setSliderRef] = React.useState<any>(null);

  return (
    <div className="w-full h-full flex mt-6">
      {/* Content */}
      <div className="w-full flex flex-col ">
        <div className="w-full grid md:grid-cols-[60%_40%] lg:grid-cols-[65%_35%] xl:grid-cols-[60%_40%] 2xl:grid-cols-2 grid-cols-1">
          {/* Slider Left Side */}
          <div className="w-full flex flex-col">
            {/* Buttons */}
            <div className="w-full flex items-center justify-end mb-2">
              <button onClick={sliderRef?.slickPrev}>
                <ArrowBackIosIcon className="mr-2" />
              </button>
              {/* Next Btn */}
              <button onClick={sliderRef?.slickNext}>
                <ArrowForwardIosIcon />
              </button>
            </div>

            <Slider {...settings} ref={setSliderRef}>
              {arr.map((item) => (
                <div key={item}>
                  <img src={item} alt="vanguard icon" className=" object-cover " loading="lazy"/>
                </div>
              ))}
            </Slider>
          </div>
          {/* Right Side */}
          <div className="w-full h-full flex justify-center items-center p-5">{indexSwitch()}</div>
        </div>
      </div>
    </div>
  );
}
