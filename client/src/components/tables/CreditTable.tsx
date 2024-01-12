import * as React from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";




export default function CreditTable () {
    const data = [
        {
            score: `Superprime: 781-850`,
            avgNewCar: 5.61,
            avgUsedCar: 7.43
        },
        {
            score: 'Prime: 661-780',
            avgNewCar: 6.88,
            avgUsedCar: 9.33
        },
        {
            score: "Nonprime: 601-660",
            avgNewCar: 9.29,
            avgUsedCar: 13.53
        },
        {
            score: "Subprime: 501-600",
            avgNewCar: 11.86,
            avgUsedCar: 18.39
        },
        {
            score: "Subprime: 501-600",
            avgNewCar: 14.17,
            avgUsedCar: 21.18
        },
    ]
  return (
    <div className='w-full max-h-[500px] overflow-y-auto overflow-hidden mb-10'>
      <TableContainer className="" sx={{ overflowX: "initial" }}>
          <Table stickyHeader aria-label="customized table">
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
                <TableCell className='lg:text-[17px] text-[14px]'>Credit Score</TableCell>
                <TableCell className='lg:text-[17px] text-[14px]'>Average APR, new car</TableCell>
                <TableCell className='lg:text-[17px] text-[14px]'>Average APR, used car</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((item: any, index: any) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:nth-of-type(odd)": { backgroundColor: "#DCDCDC" },
                  }}
                >
                  <TableCell component="th" scope="row" className='lg:text-[16px] text-[13px]'>
                    {item?.score}
                  </TableCell>
                  <TableCell className='lg:text-[16px] text-[13px]'>{item.avgNewCar}%</TableCell>
                  <TableCell className='lg:text-[16px] text-[13px]'>{item.avgUsedCar}%</TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </div>
  );
}
