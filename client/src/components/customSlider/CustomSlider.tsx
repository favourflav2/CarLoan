import * as React from "react";
import { UseSelector } from "../../redux/store";
import { Slider } from "@mui/material";
import { IndexNames } from "../../pages/CarPage/CarPageInputs";

const marks = [
  {
    value: 36,
    label: "36",
  },
  {
    value: 48,
    label: "48",
  },
  {
    value: 60,
    label: "60",
  },
  {
    value: 72,
    label: "72",
  },
  {
    value: 84,
    label: "84",
  },
  {
    value: 96,
    label: "96",
  },
  {
    value: 108,
    label: "108",
  },
  {
    value: 120,
    label: "120",
  },
];

export interface ICustomSliderProps {
  handleSliderChange: (event: Event, newValue: number | number[], name: IndexNames) => void;
  value: number;
  max: number;
  min: number;
  indexName: IndexNames;
  updateList: string[];
}

export default function CustomSlider({ handleSliderChange, value, min, max, indexName, updateList }: ICustomSliderProps) {
  //Redux States
  const { lightAndDarkMode } = UseSelector((state) => state.app);

  // find ... if name is in the array ... means the value has been updated/changed
  //   const findUpdate = updateList.find(item => item === indexName)
  const findUpdate = updateList.includes(indexName);

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: `USD`,
  });

  // Switch Function that makes this a re-useable
  function switchLabelValue(type: IndexNames, value: number) {
    switch (type) {
      case "term":
        return <div>{`${value} months`}</div>;
      case "interest":
        return <div>{`${value}%`}</div>;
      default:
        return <div>{USDollar.format(value)}</div>;
    }
  }

  function checkValue(value: number) {
    if (typeof value === "number") {
      if (isNaN(value)) {
        return 0;
      } else {
        return value;
      }
    } else {
      return 0;
    }
  }

  return (
    <Slider
      sx={{
        "& .MuiSlider-valueLabel": {
          fontSize: 14,
          fontWeight: lightAndDarkMode ? "bold" : "normal",
          top: -2,
          backgroundColor: "unset",
          color: lightAndDarkMode ? "#d1d5db" : "black",
          "&::before": {
            display: "none",
          },
          "& *": {
            background: "transparent",
            color: lightAndDarkMode ? "#d1d5db" : "black",
          },
        },
        '& .MuiSlider-markLabel': {
            color: lightAndDarkMode ? "#d1d5db" : "black",
          },
        "& .MuiSlider-thumb": {
          height: 24,
          width: 24,
          backgroundColor: "#fff",
          border: `2px solid ${findUpdate ? '#FFAA33' : '#00A36C'}`,
          "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
            boxShadow: "inherit",
          },
          "&::before": {
            display: "none",
          },
        },
        "& .MuiSlider-track": {
          border: "none",
          height: 5,
          color: `${findUpdate ? '#FFAA33' : '#00A36C'}`,
        },
        "& .MuiSlider-rail": {
          opacity: 0.5,
          boxShadow: "inset 0px 0px 4px -2px #000",
          backgroundColor: "#d0d0d0",
        },
      }}
      aria-label="Temperature"
      className="mx-4"
      value={checkValue(value)}
      onChange={(e) => handleSliderChange(e, value, indexName)}
      min={min}
      max={max}
      valueLabelFormat={(value) => switchLabelValue(indexName, value)}
      valueLabelDisplay="on"
      marks={indexName === "term" && marks}
      step={indexName === "term" ? 12 : undefined}
    />
  );
}
