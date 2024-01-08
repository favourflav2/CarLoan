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
    20000, // amount
    60, // installments number
    5, // interest rate
    "annuity" // loanType: 'annuity' | 'annuityDue' | 'diminishing' | GetNextInstalmentPartFunction
  );

  // Format the price above to USD using the locale, style, and currency.
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  console.log(loan);

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
