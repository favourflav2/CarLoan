import * as React from "react";
import Slider from "react-slick";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { BooksArrayObj } from "../../../../redux/features/howToInvestSlice";
import { Skeleton } from "@mui/material";
import BookCard from "../cards/BookCard";

export interface IBooksSliderProps {
  data: Array<BooksArrayObj>;
  loading: boolean;
  fetch: boolean;
}

export default function BooksSlider({ data, loading, fetch }: IBooksSliderProps) {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    vertical: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  // Next and Back Slider Buttons
  const [sliderRef, setSliderRef] = React.useState<any>(null);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-full grid grid-cols-[5%_90%_5%]">
        {/* Back Btn */}
        <button onClick={sliderRef?.slickPrev}>
          <ArrowBackIosIcon />
        </button>

        {/* Mapped Data Slider */}
        <div className="w-full h-auto flex flex-col">
          <Slider {...settings} ref={setSliderRef}>
            {loading || fetch
              ? Array(10)
                  .fill("loading")
                  .map((item, index) => (
                    <div key={index}>
                      <Skeleton variant="rectangular" className="h-[250px] mx-2" />
                    </div>
                  ))
              : data.map((item) => (
                  <div key={item.bookId}>
                    <BookCard item={item} />
                  </div>
                ))}
          </Slider>
        </div>

        {/* Next Btn */}
        <button onClick={sliderRef?.slickNext}>
          <ArrowForwardIosIcon />
        </button>
      </div>
    </div>
  );
}
