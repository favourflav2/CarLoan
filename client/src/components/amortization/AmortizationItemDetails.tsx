import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

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

export default function AmortizationItemDetails({ data}: LoanObj) {
  // Format the price above to USD using the locale, style, and currency.
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return (
    <div className="w-full max-h-[500px] flex flex-col">
      <div className="w-full h-auto overflow-y-auto overflow-hidden">
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
              {data?.installments?.map((item: any, index: any) => (
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
    </div>
  );
}
