import * as React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LogarithmicScale, ChartOptions, TooltipItem } from "chart.js";
import { Line } from "react-chartjs-2";
import { Filler } from "chart.js";
import { UseSelector } from "../../redux/store";
import { LoanAmmortizationType, MyLoanForLoop } from "../helperFunctions/loanfunctions/LoanFunction";

export interface ICarHouseChartProps {
    type: "Car" | "House"
    regualarLoan: LoanAmmortizationType
   
}

export default function CarHouseChart ({type, regualarLoan}: ICarHouseChartProps) {
      // Redux States
  const { lightAndDarkMode } = UseSelector((state) => state.app);
  const {myLoan} = regualarLoan

  const data = {
    labels: myLoan.map((item: MyLoanForLoop) => {
      return item.time;
    }),
    datasets: [
      {
        label: "Monthly Payment",
        data: myLoan.map((item: MyLoanForLoop) => {
          return item.price;
        }),
        borderColor: "#00A36C",
        backgroundColor: "#00A36C",
        tension: 0.6,
        pointRadius: 1,
      },
    //   {
    //     label: "What you'll need",
    //     data: need.data.map((item: Data) => {
    //       return item.value;
    //     }),
    //     borderColor: "#FFAA33",
    //     tension: 0.6,
    //     pointRadius: 1,
    //   },
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
        // callbacks: {
        //   title: titleTooltip,
        //   label: labelTooltip,
        // },
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

  return (
    <div className="w-full h-auto flex flex-col">
      {/* Legend */}
      <div className="w-full flex items-center justify-around mt-3 lg:mb-1 mb-3">
        {/* Have */}
        <div className="w-auto flex items-center">
          <div className="w-[25px] h-[15px] bg-chartGreen rounded-sm" />
          <p className="text-[13px] ml-1">Monthly Payment</p>
        </div>

        {/* Need */}
        <div className="w-auto flex items-center">
          <div className="w-[25px] h-[15px] bg-chartYellow rounded-sm" />
          <p className="text-[13px] ml-1">Extra Monthly Payments</p>
        </div>
      </div>
      {/* Chart */}
      <div className="w-full min-[900px]:h-[500px] h-[350px]  flex flex-col">{myLoan ? <Line options={options} data={data} plugins={hoverLine} /> : null}</div>
    </div>
  );
}
