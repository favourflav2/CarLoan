import * as React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LogarithmicScale, ChartOptions, TooltipItem } from "chart.js";
import { Line } from "react-chartjs-2";
import { FTVOppCost } from "../helperFunctions/oppCostFunctions/oppCostFunction";
import { HouseObjWithFormattedData } from "../../redux/features/modalSlices/houseSlice";
import { USDollar } from "../../pages/CarPage/CarPage";
import { Filler } from "chart.js";
import { UseSelector } from "../../redux/store";
import { HouseMonthlyPayment } from "../helperFunctions/loanfunctions/HouseLoanFuntion";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, LogarithmicScale);

export interface IOppCostChartProps {
  breakEvenOppCost: FTVOppCost;
  rentOppCost: FTVOppCost;
  diffOppCost: FTVOppCost;
  selectedGoal: HouseObjWithFormattedData;
  monthlyPayment: HouseMonthlyPayment;
}

export default function OppCostChart({ breakEvenOppCost, rentOppCost, diffOppCost, selectedGoal, monthlyPayment }: IOppCostChartProps) {
  // Redux States
  const { lightAndDarkMode } = UseSelector((state) => state.app);
  const data = {
    labels: breakEvenOppCost.data.map((item: { time: number; value: number }) => {
      return item.time;
    }),
    datasets: [
      {
        label: "breakEven",
        data: breakEvenOppCost.data.map((item: { time: number; value: number }) => {
          return item.value;
        }),
        borderColor: "#00A36C",
        backgroundColor: "#00A36C",
        tension: 0.6,
        pointRadius: 1,
      },
      {
        label: "rent",
        data: rentOppCost.data.map((item: { time: number; value: number }) => {
          return item.value;
        }),
        borderColor: "#FFAA33",
        backgroundColor: "#FFAA33",
        tension: 0.6,
        pointRadius: 1,
      },
      {
        label: "diff",
        data: diffOppCost.data.map((item: { time: number; value: number }) => {
          return item.value;
        }),
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.6,
        pointRadius: 1,
      },
    ],
  };

  const hoverLine = [
    {
      id: "hoverLineDark",
      afterDatasetsDraw: (chart: any) => {
        const {
          ctx,
          tooltip,
          //data,
          chartArea: { top, bottom },
        } = chart;
        if (tooltip?._active?.length > 0) {
          const xCord = tooltip._active[0].element.x;

          ctx.beginPath();
          ctx.strokeStyle = "#959595";
          ctx.lineWidth = 1;
          ctx.moveTo(xCord, top);
          ctx.lineTo(xCord, bottom);
          ctx.stroke();
        }
      },
    },
  ];

  const titleTooltip = (tooltipItems: TooltipItem<"line">[]) => {
    const label = tooltipItems.map((item: any) => item.label).slice(0, 1);

    return `Year: ${label}`;
  };

  function labelTooltip(item: any) {
    return `${item.datasetIndex === 0 ? "Total:" : "Total:"} ${USDollar.format(item.raw.toFixed(2))}`;
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as "index",
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: `${lightAndDarkMode ? "#17120e" : "#D3D3D3"}`,
        titleColor: `${lightAndDarkMode ? "white" : "black"}`,
        bodyColor: `${lightAndDarkMode ? "white" : "black"}`,
        padding: 10,
        usePointStyle: true,
        callbacks: {
          title: titleTooltip,
          label: labelTooltip,
        },
      },
    },
    scales: {
      x: {
        border: {
          color: `${lightAndDarkMode ? "#1c1c1c" : "#c8c6c6"}`,
        },
        grid: {
          display: false,
          tickColor: `${lightAndDarkMode ? "#1c1c1c" : "#c8c6c6"}`,
          color: `${lightAndDarkMode ? "#1c1c1c" : "#c8c6c6"}`,
          //tickBorderDash: `${lightAndDarkMode ? '#1c1c1c':'#c8c6c6'}` ,
        },
        ticks: {
          callback: function (index) {
            if (
              index === 0 ||
              index === Math.ceil((data.labels.length - 1) / 2) ||
              index === data.labels.length - 1 ||
              index === Math.ceil(((data.labels.length - 1) * 3) / 4) ||
              index === Math.ceil(((data.labels.length - 1) * 1) / 4)
            ) {
              return data.labels[index];
            }
          },
          color: `${lightAndDarkMode ? "white" : "black"}`,
          font: {
            size: 13,
          },
        },
      },
      y: {
        border: {
          color: `${lightAndDarkMode ? "#1c1c1c" : "#c8c6c6"}`,
        },
        grid: {
          tickColor: `${lightAndDarkMode ? "#1c1c1c" : "#c8c6c6"}`,
          color: `${lightAndDarkMode ? "#1c1c1c" : "#c8c6c6"}`,
        },
        ticks: {
          color: `${lightAndDarkMode ? "white" : "black"}`,

          font: {
            size: 13,
          },
        },
      },
    },
  };

//   const totalPaid = USDollar.format(Number(monthlyPayment.totalAmountPaid.toFixed(2)));
//   const totalInterst = USDollar.format(Number(monthlyPayment.interestSum.toFixed(2)));

  return (
    <div className="w-full h-auto flex flex-col mt-2">
      {/* Legend */}
      <div className="w-full flex md:items-center items-start justify-normal md:justify-around md:flex-row flex-col mt-3 lg:mb-1 mb-3">
        {/* Break Even Point Per Month */}
        <div className="w-auto flex items-center md:mb-0 mb-1">
          <div className="w-[25px] h-[15px] bg-chartGreen rounded-sm" />
          <p className="text-[13px] ml-1">Break Even Point Per Month</p>
        </div>

        {/* Rent Per Month */}
        <div className="w-auto flex items-center md:mb-0 mb-1">
          <div className="w-[25px] h-[15px] bg-chartYellow rounded-sm" />
          <p className="text-[13px] ml-1">Rent Per Month</p>
        </div>

        {/* Difference in Breakeven and Rent (Breakeven - Rent) */}
        <div className="w-auto flex items-center md:mb-0 mb-1">
          <div className="w-[25px] h-[15px] bg-blue-500 rounded-sm" />
          <p className="text-[13px] ml-1">
            Difference in Breakeven and Rent {""}  <span className=" sm:block hidden ml-1"> (Breakeven - Rent )</span>
          </p>
        </div>
      </div>
      {/* Chart */}
      <div className="w-[99%] min-[900px]:h-[500px] h-[350px] relative">{<Line options={options} data={data} plugins={hoverLine} />}</div>

      <div className="w-full h-auto flex flex-col mb-4 mt-7">
        {/* Content */}
        <div className="w-full h-full flex flex-col px-4">
          {/* Home Purchase Facts */}
          {/* <div className="w-auto flex flex-col h-auto">
            <h1 className=" underline font-bold mb-[4px]">Home Purchase</h1>
            <p className="text-[15px]">
              * For a <span className="font-bold italic">{USDollar.format(selectedGoal.price)}</span> house you would have paid <span className="font-bold italic">{totalPaid}</span>, and{" "}
              <span className="font-bold italic">{totalInterst}</span> of that would have been in interest.
            </p>

            <p className="mt-3 text-[15px]">
              * With a <span className="font-bold italic">{selectedGoal.term} year</span> mortgage and a home appreciation rate of <span className="font-bold italic">{selectedGoal.appreciation}%</span> your{" "}
              <span className="font-bold italic">{USDollar.format(selectedGoal.price)} dollar </span> home if appreciation averages 2% will be{" "}
              <span className="font-bold italic">{USDollar.format(Number(futureValueOfPresentValue(selectedGoal.price, selectedGoal.appreciation, selectedGoal.term).toFixed(2)))}</span>.
            </p>

            <p className="mt-3 text-[15px]">
              * Paying off your mortgage comes with its own benefits. However, visually seeing the opportunity cost associated with locking yourself in a mortgage should give you a better understating of the rent vs owning debate.
            </p>

            <p className="mt-3 text-[17px] italic">
              The number to beat is <span className="font-bold italic">{USDollar.format(Number(futureValueOfPresentValue(selectedGoal.price, selectedGoal.appreciation, selectedGoal.term).toFixed(2)))} dollars</span>, what if instead of owning a home you choose to rent and invested the difference into the stock market ?
            </p>

           

            
          </div> */}

          {/* Bottom Legend */}
          <div className="w-full flex flex-col md:grid md:grid-cols-2 md:gap-y-5 2xl:flex 2xl:items-center 2xl:justify-around 2xl:flex-row  mt-3 lg:mb-1 mb-3 ">


            {/* Break Even Point Per Month */}
            <div className="w-auto flex flex-col">
              {/* TItle Header */}
              <div className="w-auto flex items-center">
                <div className="w-[25px] h-[15px] bg-chartGreen rounded-sm" />
                <p className="text-[13px] ml-1">Break Even Point Per Month</p>
              </div>

              {/* About */}
              <div className="w-auto flex flex-col mt-[6px]">
                <h1 className="text-[13.5px] ">
                  Total Contributed: <span className=" italic font-bold">{breakEvenOppCost.totalPrincipal}</span>
                </h1>
                <h1 className="text-[13.5px] ">
                  Accured Interest: <span className=" italic font-bold">{breakEvenOppCost.totalInterst}</span>
                </h1>
                <h1 className="text-[13.5px]">
                  Total Balance: <span className="sm:no-underline underline italic font-bold">{breakEvenOppCost.highestNum}</span>
                </h1>
              </div>
            </div>

            {/* Rent Per Month */}
            <div className="w-auto flex flex-col md:my-0 my-3 md:px-4">
              {/* TItle Header */}
              <div className="w-auto flex items-center">
                <div className="w-[25px] h-[15px] bg-chartYellow rounded-sm" />
                <p className="text-[13px] ml-1">Rent Per Month</p>
              </div>

              {/* About */}
              <div className="w-auto flex flex-col mt-[6px]">
                <h1 className="text-[13.5px] ">
                  Total Contributed: <span className=" italic font-bold">{rentOppCost.totalPrincipal}</span>
                </h1>
                <h1 className="text-[13.5px] ">
                  Accured Interest: <span className=" italic font-bold">{rentOppCost.totalInterst}</span>
                </h1>
                <h1 className="text-[13.5px]">
                  Total Balance: <span className="sm:no-underline underline italic font-bold">{rentOppCost.highestNum}</span>
                </h1>
              </div>
            </div>

            {/* Difference in Breakeven and Rent (Breakeven - Rent) */}
            <div className="w-auto flex flex-col">
              {/* TItle Header */}
              <div className="w-auto flex items-center">
                <div className="w-[25px] h-[15px] bg-blue-500 rounded-sm" />
                <p className="text-[13px] ml-1">Difference in Breakeven and Rent</p>
              </div>

              {/* About */}
              <div className="w-auto flex flex-col mt-[6px]">
                <h1 className="text-[13.5px] ">
                  Total Contributed: <span className=" italic font-bold">{diffOppCost.totalPrincipal}</span>
                </h1>
                <h1 className="text-[13.5px] ">
                  Accured Interest: <span className=" italic font-bold">{diffOppCost.totalInterst}</span>
                </h1>
                <h1 className="text-[13.5px]">
                  Total Balance: <span className="sm:no-underline underline italic font-bold">{diffOppCost.highestNum}</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
