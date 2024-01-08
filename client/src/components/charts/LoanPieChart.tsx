import * as React from 'react';
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

export interface ILoanPieChartProps {
    data:{
        installments  : [
            {
              capital     : number,
              interest    : number,
              installment : number,
              remain      : number
            },
            //...
          ],
          amount        : number,
          interestSum   : number,
          capitalSum    : number,
          sum           : number
    }
}

export default function LoanPieChart ({data}: ILoanPieChartProps) {

  // Format Price
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });


    // Helper Function
  function grabMonthlyPayments(array: any) {
    let monthlyP = array?.installments[0]?.installment;
    let totalInterest = array?.interestSum;
    let totalPaid = array?.sum;
    let loanAmount = array?.amount;

    return {
      monthlyP,
      totalInterest,
      totalPaid,
      loanAmount,
    };
  }
  return (
    <>
    <div className='w-full h-auto  sm:flex hidden '>
      <PieChart
      series={[
        {
            arcLabel: (item) => `${USDollar.format(item.value)} (${((item.value / grabMonthlyPayments(data)?.totalPaid) * 100).toFixed()})%`,
          data: [
            {id:0, value: grabMonthlyPayments(data)?.totalInterest, label: "Interest" },
            {id:1, value: grabMonthlyPayments(data)?.loanAmount, label: "Principal"}
          ],
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'black',
          fontWeight: 'bold',
          fontSize:"11px"
        },
      }}
      
      height={300}
    />
    </div>

    <div className='w-full h-auto  sm:hidden flex '>
      <PieChart
      series={[
        {
            arcLabel: (item) => `${USDollar.format(item.value)} (${((item.value / grabMonthlyPayments(data)?.totalPaid) * 100).toFixed()})%`,
          data: [
            {id:0, value: grabMonthlyPayments(data)?.totalInterest, label: "Interest" },
            {id:1, value: grabMonthlyPayments(data)?.loanAmount, label: "Principal"}
          ],
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'black',
          fontWeight: 'bold',
          fontSize:"11px"
        },
      }}
      
      height={200}
    />
    </div>
    </>
  );
}
