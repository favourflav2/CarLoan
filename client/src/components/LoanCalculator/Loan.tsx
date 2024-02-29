import * as React from "react";
import { Loan } from "loanjs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { PieChart as PieChart2 } from "react-minimal-pie-chart";
import dayjs from "dayjs";

interface LoanObj {
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


export default function LoanCalculator() {
  const loan = new Loan(
    2000, // amount
    504, // installments number
    6, // interest rate
    "annuity" // loanType: 'annuity' | 'annuityDue' | 'diminishing' | GetNextInstalmentPartFunction
  );

  // Format the price above to USD using the locale, style, and currency.
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
const today = new Date ()
const formattedDate = dayjs(today).format('MMMM')

function getDateIndex(){
  const month= ["January","February","March","April","May","June","July",
  "August","September","October","November","December"];

  return month.findIndex(item => item === formattedDate) 
}
function returnData(){
  let res = []
  for(let i=0; i< 50; i ++){
    let age = 18
    let num;
    

    const amount = 10000;
    const time = i + 1
    const monthlyP = 500;
    const c = 1
    const months = 12
    const rate = 0.06 / c
    const equivalentPeriodicRate = ((Math.pow(1 + rate, c / months) - 1))
    const fvOfPv = amount * (Math.pow(1 + equivalentPeriodicRate, time * months))
    
    const top = monthlyP * (Math.pow(1+ equivalentPeriodicRate, time * 12) - 1)
    const value = top / equivalentPeriodicRate
    res.push({
      age: age + i,
      value: value + fvOfPv
    })
    //console.log(value + fvOfPv)

   
    

    

    
  }
return res
}

function newReturnData(){
  let res = []
  for(let i=0; i< 27; i ++){
    let age = 68
    let num;
    

   
    const time = i + 1
    const monthlyP = 2000;
    const c = 1
    const months = 12
    const rate = 0.08 / c
    const equivalentPeriodicRate = ((Math.pow(1 + rate, c / months) - 1))
    
    
    const top = monthlyP * (Math.pow(1+ equivalentPeriodicRate, time * 12) - 1)
    const value = top / equivalentPeriodicRate
    res.push({
      age: age + i,
      value: value 
    })

  }
return res
}

console.log(newReturnData())

  console.log(getDateIndex())
  // 1063328
  // 1055703
  // 1,682,314
  // 1,856,089


  return (
    <div className="w-auto h-auto flex flex-col">
      <h1>Amortization Schedule</h1>

      <div className="w-[500px] max-h-[500px] overflow-y-auto overflow-hidden">
        <TableContainer className="" sx={{ overflowX: "initial" }}>
          <Table size="small" stickyHeader aria-label="customized table">
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    color: "white",
                    backgroundColor: "#6699CC",
                    fontWeight: "bold",
                  },
                }}
              >
                <TableCell>Month</TableCell>
                <TableCell>Interest</TableCell>
                <TableCell>Monthly Payment</TableCell>
                <TableCell>Ending Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loan?.installments?.map((item: any, index: any) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:nth-of-type(odd)": { backgroundColor: "#DCDCDC" },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>${item.interest.toFixed(2)}</TableCell>
                  <TableCell>${item.capital.toFixed(2)}</TableCell>
                  <TableCell>{USDollar.format(item.remain.toFixed(2))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <PieChart
      series={[
        {
            arcLabel: (item) => `${((item.value / grabMonthlyPayments(loan)?.totalPaid) * 100).toFixed()}%`,
          data: [
            {id:0, value: grabMonthlyPayments(loan)?.totalInterest, label: "Interest" },
            {id:1, value: grabMonthlyPayments(loan)?.loanAmount, label: "Principal"}
          ],
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'black',
          fontWeight: 'bold',
          fontSize:"12px"
        },
      }}
      width={400}
      height={200}
    />

      
    </div>
  );
}

// <NumericFormat value={item.remain.toFixed(2)} prefix={"$"} thousandSeparator={true} />

// ${Math.round(grabMonthlyPayments(loan)?.totalInterest / grabMonthlyPayments(loan)?.totalPaid)}
