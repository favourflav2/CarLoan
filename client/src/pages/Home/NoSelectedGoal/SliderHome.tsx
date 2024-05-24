import * as React from "react";
import Slider from "react-slick";
import inputs from '../../../assets/inputsAndChart.png'
import cars from '../../../assets/cars.png'
import costOfOwning from '../../../assets/costOfOwning.png'
import goalDetails from '../../../assets/goalDetails.png'

export interface ISliderHomeProps {}

export default function SliderHome(props: ISliderHomeProps) {
  const settings = React.useMemo(() => {
    return {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
  }, []);

  // var settings = {
  //     dots: true,
  //     infinite: true,
  //     speed: 500,
  //     slidesToShow: 1,
  //     slidesToScroll: 1
  //   };
  return (
    <div className="w-full h-auto  ">
      <Slider {...settings}>
        <div>
          <img src={inputs} alt="" className="w-full h-[350px] object-cover"/>
        </div>
        <div>
          {/* <img src={cars} alt="" className="w-full h-[350px] object-cover"/> */}
        </div>
        <div>
           <img src={costOfOwning} alt="" className="w-full h-[350px] object-cover"/>
        </div>
        <div>
           <img src={goalDetails} alt="" className="w-full h-[350px] object-contain"/>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Slider>
    </div>
  );
}
