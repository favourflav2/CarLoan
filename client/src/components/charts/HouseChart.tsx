import * as React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LogarithmicScale, ChartOptions, TooltipItem } from "chart.js";
import { Line } from "react-chartjs-2";
import { UseSelector } from "../../redux/store";
import { Filler } from "chart.js";
import { LoanAmmortizationType, MyLoanForLoop } from "../helperFunctions/loanfunctions/LoanFunction";
import { MonthlyPayment } from "../helperFunctions/loanfunctions/LoanFunction";
import { ExtraNumberYears } from "../helperFunctions/loanfunctions/HouseLoanFuntion";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, LogarithmicScale);

export interface IHouseChartProps {
  regualarLoan: LoanAmmortizationType;
  extraLoan: MyLoanForLoop[] | undefined;
  monthlyPayment: MonthlyPayment;
  extraNumberOfYears: ExtraNumberYears | undefined;
  downPayment: number;
}

export default function HouseChart({ regualarLoan, extraLoan, monthlyPayment, extraNumberOfYears, downPayment }: IHouseChartProps) {
  // Redux States
  const { lightAndDarkMode, selectedGoal } = UseSelector((state) => state.app);
  const { myLoan } = regualarLoan;

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: `USD`,
  });

  const data = {
    labels: myLoan.map((item: MyLoanForLoop) => {
      return item.time;
    }),
    datasets: [
      {
        label: "Remaining Balance",
        data: myLoan.map((item: MyLoanForLoop) => {
          return item.price;
        }),
        borderColor: "#00A36C",
        backgroundColor: "#00A36C",
        tension: 0.6,
        pointRadius: 1,
      },
      {
        label: "Remaining Balance",
        data:
          monthlyPayment.extraMonthlyPayment > 0 && extraLoan
            ? extraLoan.map((item: MyLoanForLoop) => {
                return item.price;
              })
            : null,
        borderColor: "#FFAA33",
        backgroundColor: "#FFAA33",
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
    return `${item.datasetIndex === 0 ? "Remaining:" : "Remaining:"} ${USDollar.format(item.raw.toFixed(2))}`;
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

  const extraPTotalAmountPaid = extraNumberOfYears && Number(monthlyPayment.extraMonthlyPayment * extraNumberOfYears.numberOfYearsNoRounding + downPayment);

  function returnMonths(value:ExtraNumberYears | undefined) {
    if(!value?.numberOfYearsNoRounding) return null
    let res = value.numberOfYearsNoRounding
    res = Math.abs(res)
    const deciaml = (res - Math.floor(res))
    const answer = deciaml * 12
    return Math.round(answer)
}

function returnYears(value:ExtraNumberYears | undefined){
    if(!value?.numberOfYears) return null
    return Math.trunc(value.numberOfYears)
}



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
      <div className="w-full min-[900px]:h-[500px] h-[350px]  flex flex-col">{myLoan.length ? <Line options={options} data={data} plugins={hoverLine} /> : null}</div>
      <h1>hey</h1>

      <div className="w-full h-auto flex flex-col mb-4 mt-7">
        {/* Content */}
        <div className="w-full flex sm:justify-around flex-col sm:flex-row">
            {/* Monthly Payment */}
          <div className="w-auto flex flex-col sm:mb-0 mb-4">
            <h1 className=" font-bold underline">Monthly Payment</h1>
            <h1 className="text-[15px] mt-[1px]">
              Total amount paid: <span className="font-bold">{USDollar.format(Number(monthlyPayment.totalAmountPaid.toFixed(2)))}</span>{" "}
            </h1>
          </div>

          {selectedGoal && selectedGoal.type === "House" && selectedGoal.extraPayment > 0 && extraPTotalAmountPaid && (
            <div className="w-auto flex flex-col">
              <h1 className=" font-bold underline">Extra Monthly Payment</h1>
              <h1 className="text-[15px]  mt-[1px]">
                Total amount paid: <span className="font-bold text-chartGreen ">{USDollar.format(Number(extraPTotalAmountPaid.toFixed(2)))}</span>{" "}
              </h1>
              <h1 className="text-[15px] ">
                Pay off date: <span className="font-bold text-chartGreen "> Approx {returnYears(extraNumberOfYears)} years {returnMonths(extraNumberOfYears)} months </span>{" "}
              </h1>
              <h1 className="text-[15px] ">
                You save: <span className="font-bold text-chartGreen "> {USDollar.format(Number(Math.abs(monthlyPayment.totalAmountPaid - extraPTotalAmountPaid).toFixed(2)))} </span>{" "}
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
