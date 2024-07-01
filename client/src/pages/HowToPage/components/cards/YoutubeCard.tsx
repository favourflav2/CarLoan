import * as React from "react";
import { useGetVideoLinksByIdQuery } from "../../../../redux/api/howToInvestApi";
import Slider from "react-slick";
import YoutubeReactPlayer from "./YoutubeReactPlayer";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { CircularProgress } from "@mui/material";
import { UseSelector } from "../../../../redux/store";

export interface IYoutubeCardProps {
  id: string;
}

export default function YoutubeCard({ id }: IYoutubeCardProps) {
 // Redux States
  const { lightAndDarkMode } = UseSelector((state) => state.app);

  const { data, isFetching, error, isLoading } = useGetVideoLinksByIdQuery({ creatorId: id });

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    arrows: false,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };


  const [sliderRef, setSliderRef] = React.useState<any>(null);

  if(error){
    return null
  }
  return (
    <div className="w-full h-auto flex flex-col">
      {/* Youtube Card */}
      <div className="w-full h-full flex flex-col">
        {isFetching || isLoading ? (
          <div className="w-full h-auto flex justify-center items-center my-4">
            <CircularProgress size="30px" sx={{ color: `${lightAndDarkMode ? "#9ca3af" : "#9ca3af"}` }} />
          </div>
        ) : (
          <div className=" w-full flex flex-col  mt-4">
            {/* Breakpoint above 1024 will show a grid */}
            <div className="w-full lg:grid hidden grid-cols-3 gap-3">
              {data?.map((item) => (
                <div key={item.idVideoLink}>
                  <YoutubeReactPlayer link={item.link}  />

                  {/* About Section */}
                  <div className="w-full flex flex-col mt-2">
                    <h1 className=" text-[15px] 2xl:text-[17px] font-semibold">{item.title}</h1>

                    <h1 className=" text-[12px] 2xl:text-[13px] mt-1 leading-5">{item.aboutVideoLink}</h1>
                  </div>
                </div>
              ))}
            </div>


            {/* Anything below 1024px breakpoint I will show slider -------------- Mobile ------------------ */}
            <div className=" w-full h-auto lg:hidden flex flex-col">
              {/* Arrows */}
              <div className="w-full h-auto flex justify-end items-end mb-2">
                <div className="w-auto flex items-center">
                  {/* Back Arrow */}
                  <button>
                    <ArrowBackIosIcon className=" text-[20px]" onClick={sliderRef?.slickPrev} />
                  </button>
                  {/* Forward Arrow */}
                  <button>
                    <ArrowForwardIosIcon className=" text-[20px]" onClick={sliderRef?.slickNext} />
                  </button>
                </div>
              </div>
              {/* Slider */}
              <Slider {...settings} ref={setSliderRef} className="w-full justify-center flex">
                {data?.map((item) => (
                  <div className="px-2 flex flex-col w-full h-full mb-3" key={item.idVideoLink}>
                    {/* Youtube Box */}
                    <YoutubeReactPlayer link={item.link}  />

                    {/* About Section */}
                    <div className="w-full flex flex-col mt-2">
                      <h1 className="sm:text-[13px] text-[12px] font-semibold">{item.title}</h1>

                      <h1 className=" text-[12px] mt-1">{item.aboutVideoLink}</h1>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
