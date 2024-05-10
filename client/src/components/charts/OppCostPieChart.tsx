import * as React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, TooltipItem } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { FTVOppCost } from "../helperFunctions/oppCostFunctions/oppCostFunction";
import { USDollar } from "../../pages/CarPage/CarPage";
import { UseSelector } from "../../redux/store";
import { useMediaQuery } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface IOppCostPieChartProps {
  obj: FTVOppCost;
}

export default function OppCostPieChart({ obj }: IOppCostPieChartProps) {
  // Redux States
  const { lightAndDarkMode } = UseSelector((state) => state.app);

  // Meida Queires
  const matches = useMediaQuery("(min-width:640px)");
  const matches2 = useMediaQuery("(min-width:768px)");

  const { totalInterstNoFormat, totalPrincipalNoFormat } = obj;

  const array = [totalInterstNoFormat, totalPrincipalNoFormat];

  const data = {
    labels: ["Total Interest Accured", "Total Contribution"],
    datasets: [
      {
        label: "# of Votes",
        data: array,
        backgroundColor: lightAndDarkMode ? ["RGBA(255,170,51,0.2)", "RGBA(0,163,108,0.2)"] : ["#FFAA33", "#00A36C"],
        borderColor: ["#FFAA33", "#00A36C"],
        borderWidth: 1,
      },
    ],
  };

  const textCenter = {
    id: "textcenter",
    beforeDatasetsDraw(chart: any, args: any, pluginOptions: any) {
      const { ctx, data } = chart;

      ctx.save();
      ctx.font = pluginOptions.font;
      ctx.fillStyle = pluginOptions.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${USDollar.format(Number((data.datasets[0].data[0] + data.datasets[0].data[1]).toFixed(2)))}`, chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y);
    },
  };

  const titleTooltip = (tooltipItems: TooltipItem<"doughnut">[]) => {
    const label = tooltipItems.map((item: any) => item.label).slice(0, 1);

    return `${label}`;
  };

  function labelTooltip(item: any) {
    return `${item.datasetIndex === 0 ? "Total:" : "Total:"} ${USDollar.format(item.raw.toFixed(2))}`;
  }


  const options: ChartOptions<"doughnut"> = {
    cutout: matches2 ? 80 : matches ? 65 : 50,
    responsive: true,
    spacing:2,
    //maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as "index",
    },
    plugins: {
      // @ts-ignore
      textcenter: {
        color: `${lightAndDarkMode ? "white" : "black"}`,
        font: `bold ${matches ? "15px" : "12px"} sans-serif`,
      },
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
  };

  return (
    <div className="w-[250px] md:h-[250px] sm:h-[190px] h-[170px]  relative ">
      <Doughnut data={data} plugins={[textCenter]} options={options} />
    </div>
  );
}

// if dougnut is not respocive then I will have to use w-99%
