import * as React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LogarithmicScale, ChartOptions, TooltipItem } from "chart.js";
import { Line } from "react-chartjs-2";
import { Filler } from "chart.js";

export interface ILoanChartsProps {
}

export default function LoanCharts (props: ILoanChartsProps) {
  return (
    <div className="w-full h-auto flex flex-col">
      {/* Legend */}
      <div className="w-full flex items-center justify-around mt-3 lg:mb-1 mb-3">
        {/* Have */}
        <div className="w-auto flex items-center">
          <div className="w-[25px] h-[15px] bg-chartGreen rounded-sm" />
          <p className="text-[13px] ml-1">What You Have</p>
        </div>

        {/* Need */}
        <div className="w-auto flex items-center">
          <div className="w-[25px] h-[15px] bg-chartYellow rounded-sm" />
          <p className="text-[13px] ml-1">What You Need</p>
        </div>
      </div>
      {/* Chart */}
      {/* <div className="w-full min-[900px]:h-[500px] h-[350px]  flex flex-col">{need.data && have.data ? <Line options={options} data={data} plugins={hoverLine} /> : null}</div> */}
    </div>
  );
}
