import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { Dispatch, UseSelector } from "../../redux/store";
import { getOneCar, similarCars } from "../../redux/features/carSlice";
import { Skeleton, TextField, Tooltip } from "@mui/material";
import CreditTable from "../../components/tables/CreditTable";
import { NumericFormat } from "react-number-format";
import {
  resetItemDetailsState,
  setCompareData,
  setDownPayment,
  setInterestRate,
  setItemParamsState,
  setLoanAmount,
  setLoanData,
  setMonths,
  setTotalPrice,
  updateLoanAmount,
} from "../../redux/features/websiteSlice";
import { Loan } from "loanjs";
import AmortizationItemDetails from "../../components/amortization/AmortizationItemDetails";
import LoanPieChart from "../../components/charts/LoanPieChart";
import noImgPlaceHolder from "../../assets/noImg.png";
import CarVanaCard from "../../components/cards/CarVanaCard";
import CarDotComCard from "../../components/cards/CarDotComCard";

export interface IItemDetailsProps {}

export default function ItemDetails(props: IItemDetailsProps) {
  const { id } = useParams();
  const { singleCar, loading, similarCarsData } = UseSelector((state) => state.car);
  const { loanAmount, months, downPayment, interestRate, errorDownPayment, loanData, itemParamsState, compareData, TotalPrice, StaticDownPayment, StaticInterestRate, StaticMonths } = UseSelector(
    (state) => state.page
  );
  const dispatch = Dispatch();

  // Format Price
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // Helper Functions

  function handleSubmit() {
    if (!errorDownPayment) {
      if (typeof singleCar?.price === "number" && interestRate && months && singleCar?.price > 0 && loanAmount) {
        const loan = new Loan(
          loanAmount, // amount
          months, // installments number
          interestRate, // interest rate
          "annuity" // loanType: 'annuity' | 'annuityDue' | 'diminishing' | GetNextInstalmentPartFunction
        );

        dispatch(setLoanData(loan));
        dispatch(setTotalPrice({ loan, downPayment }));
      } else {
        alert("error with input values");
      }
    } else {
      alert("Theres an error");
    }
  }

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

  function onRenderLoan() {
    if (typeof singleCar?.price === "number" && StaticInterestRate && StaticMonths && singleCar?.price > 0) {
      const loan = new Loan(
        singleCar?.price, // amount
        StaticMonths, // installments number
        StaticInterestRate, // interest rate
        "annuity" // loanType: 'annuity' | 'annuityDue' | 'diminishing' | GetNextInstalmentPartFunction
      );
      return loan;
    }
  }

  function getLoansAtDiffrentMonths() {
    if (typeof singleCar?.price === "number" && interestRate && months && singleCar?.price > 0 && loanAmount) {
      let thirtySix = new Loan(
        loanAmount, // amount
        36, // installments number
        interestRate, // interest rate
        "annuity" // loanType: 'annuity' | 'annuityDue' | 'diminishing' | GetNextInstalmentPartFunction
      );

      let fourtyEight = new Loan(
        loanAmount, // amount
        48, // installments number
        interestRate, // interest rate
        "annuity" // loanType: 'annuity' | 'annuityDue' | 'diminishing' | GetNextInstalmentPartFunction
      );

      let sixty = new Loan(
        loanAmount, // amount
        60, // installments number
        interestRate, // interest rate
        "annuity" // loanType: 'annuity' | 'annuityDue' | 'diminishing' | GetNextInstalmentPartFunction
      );

      let seventyTwo = new Loan(
        loanAmount, // amount
        72, // installments number
        interestRate, // interest rate
        "annuity" // loanType: 'annuity' | 'annuityDue' | 'diminishing' | GetNextInstalmentPartFunction
      );

      let eightyFour = new Loan(
        loanAmount, // amount
        84, // installments number
        interestRate, // interest rate
        "annuity" // loanType: 'annuity' | 'annuityDue' | 'diminishing' | GetNextInstalmentPartFunction
      );

      let data = [
        {
          month: 36,
          obj: thirtySix,
        },
        {
          month: 48,
          obj: fourtyEight,
        },

        {
          month: 60,
          obj: sixty,
        },
        {
          month: 72,
          obj: seventyTwo,
        },
        {
          month: 84,
          obj: eightyFour,
        },
      ];

      dispatch(setCompareData(data));
    } else {
      alert("There was an error");
    }
  }

  React.useEffect(() => {
    dispatch(getOneCar({ id }));
  }, [id]); // eslint-disable-line

  React.useEffect(() => {
    if (singleCar?.price !== undefined && typeof singleCar?.price === "number") {
      dispatch(similarCars({ id: singleCar?.index }));
    }
  }, [singleCar]); // eslint-disable-line

  // First Render set loanAmount to car price
  React.useEffect(() => {
    if (loanAmount <= 0) {
      if (singleCar?.price !== undefined && typeof singleCar?.price === "number") {
        dispatch(setLoanAmount(singleCar?.price));
      }
    }
  }, [singleCar, loanAmount]); // eslint-disable-line

  // If the Id Paramas Changes we need to fetch new price and set it a loan amount
  React.useEffect(() => {
    if (itemParamsState === null) {
      dispatch(setItemParamsState(id));
    } else if (id !== itemParamsState) {
      //console.log("Lets fetch the new data")
      if (singleCar?.price !== undefined && typeof singleCar?.price === "number") {
        dispatch(setLoanAmount(singleCar?.price));
        dispatch(setItemParamsState(id));
        dispatch(resetItemDetailsState());
      }
    } else {
      if (singleCar?.price !== undefined && typeof singleCar?.price === "number") {
        dispatch(setLoanAmount(singleCar?.price));
      }
    }
  }, [id, singleCar]); // eslint-disable-line

  // Update Loan Amount when down payment changed
  React.useEffect(() => {
    // If single car is not undefined
    if (singleCar?.price !== undefined && typeof singleCar?.price === "number") {
      // if loanamount is greater than 0
      if (loanAmount > 0) {
        // if theres no error
        if (!errorDownPayment) {
          // if downpayment is larger than 0
          if (downPayment > 0) {
            dispatch(updateLoanAmount({ loan: singleCar?.price, down: downPayment }));
          } else {
            dispatch(setLoanAmount(singleCar?.price));
          }
        }
      }
    }
  }, [downPayment]); // eslint-disable-line

  const imageOnLoad = (event: any) => {
    console.log(`Picture successfully ${event.currentTarget.src} loaded.`);
    if (event.currentTarget.className !== "error") {
      event.currentTarget.className = "success";
    }
  };

  const imageOnError = (event: any) => {
    event.currentTarget.src = noImgPlaceHolder;
    event.currentTarget.className = "error";
  };

  return (
    <div className="w-full h-auto pt-[80px] lg:px-[30px] xl:px-[12%] ">
      {/* Desktop Content */}

      <div className="w-full  lg:flex hidden flex-col h-auto mb-20">
        {loading ? <Skeleton variant="rectangular" className="w-[80%] h-[50px] mb-3" /> : <h1 className="text-[35px] font-medium mb-3">{singleCar?.name_modal}</h1>}

        {/* First Box */}
        {loading ? (
          <div className="w-full flex h-auto">
            <Skeleton variant="rectangular" className="w-full mr-2 h-[350px] mb-3" />
            <Skeleton variant="rectangular" className="w-full  h-[350px] mb-3" />
          </div>
        ) : (
          <div className="w-full flex">
            {/* Img */}
            <img src={singleCar?.img} alt="Car Cover" className="w-[450px] object-cover rounded-2xl" loading="lazy" onLoad={imageOnLoad} onError={imageOnError} />

            {/* Right Side Facts About Car */}
            <div className="w-full flex flex-col ml-4  p-2 rounded-2xl">
              {/* Name */}
              <div className="flex items-center mb-1">
                <h1 className="mr-1 italic">Name:</h1>
                <h1 className="font-semibold">{singleCar?.name_modal}</h1>
              </div>

              {/* Price */}
              <div className="flex items-center my-1">
                <h1 className="mr-1 italic">Price:</h1>
                <h1 className="font-semibold">{singleCar?.price ? USDollar.format(Number(singleCar?.price.toFixed())) : "null"}</h1>
              </div>

              {/* mileage */}
              <div className="flex items-center my-1">
                <h1 className="mr-1 italic">Mileage:</h1>
                <h1 className="font-semibold">{singleCar?.mileage ? `${new Intl.NumberFormat().format(Number(singleCar?.mileage))} miles` : "null"}</h1>
              </div>

              {/* mileage */}
              <div className="flex items-center my-1">
                <h1 className="mr-1 italic">From:</h1>
                <h1 className="font-semibold">{singleCar?.type}</h1>
              </div>

              {/* mileage */}
              <div className="flex items-center my-1 w-[50%]">
                <p className="text-[9px] text-gray-500">If theres no image don't worry, some of these cars will be outdated and all it takes is my monthly update and everything will be good</p>
              </div>
            </div>
          </div>
        )}

        {/* Below First Box */}
        {/* About Credit */}
        {loading ? (
          <div className="w-full h-auto flex flex-col mt-10">
            <Skeleton variant="rectangular" className="w-full h-[50px] mb-3" />

            <Skeleton variant="rectangular" className="w-full h-[200px] mb-3" />

            <Skeleton variant="rectangular" className="w-full h-[350px] mb-3" />
          </div>
        ) : (
          <div className="w-full h-auto flex flex-col mt-10">
            <h1 className="w-full flex justify-center text-[40px] font-semibold mb-1">Credit</h1>

            <p>
              "When you’re getting ready to finance a new or used car, knowing the average car loan interest rate received by other recent car buyers is helpful. Having this information, especially
              for borrowers with a credit score similar to yours, gives you an idea of what rate to expect and a benchmark for comparing loan offers. The auto loan interest rate you receive is based
              on several factors — such as your income, credit history and credit score. Your credit score is one of the biggest factors in determining the rate you’ll get, because lenders use it to
              gauge how likely you are to repay the loan. Generally speaking, the higher your credit score, the lower your car loan interest rate is likely to be." -{" "}
              <span className=" italic text-blue-500 font-medium cursor-pointer">
                <Link target="_blank" to="https://www.nerdwallet.com/article/loans/auto-loans/average-car-loan-interest-rates-by-credit-score">
                  NerdWallet
                </Link>
              </span>
            </p>

            <h1 className="w-full flex justify-center text-[25px] mt-8 mb-2">Average car loan interest rates by credit score</h1>
            <CreditTable />
          </div>
        )}

        {/* Amorization Schedule */}
        {loading ? (
          <div className="w-full h-auto flex flex-col">
            <Skeleton variant="rectangular" className="w-full h-[800px] mb-3" />
          </div>
        ) : (
          <div className="w-full h-auto flex flex-col mt-10">
            <h1 className="w-full flex justify-center text-[40px] font-semibold mb-1">Amorization Schedule</h1>

            <p className="indent-5 mb-2">
              Consumer credit reporting company Experian releases average auto loan interest rates in its quarterly Automotive Finance Market report. In the third quarter of 2023, the overall average
              auto loan interest rate was 7.03% for new cars and 11.35% for used cars. -{" "}
              <span className=" italic text-blue-500 font-medium cursor-pointer">
                <Link target="_blank" to="https://www.nerdwallet.com/article/loans/auto-loans/average-car-loan-interest-rates-by-credit-score">
                  NerdWallet
                </Link>
              </span>
            </p>
            <p className="indent-5">
              Since the average interest rate for used cars is 11.35%, we will set the interest rate at that. However, feel free to change it and apply an interest rate to your pleasing.
            </p>

            {/* Content For Tables and Pie Chart */}
            <div className="w-full h-auto flex flex-col mt-[55px]">
              {/* Inputs and Pie CHart */}
              <div className="w-full flex ">
                {/* Left Side */}
                <div className="min-h-[250px] w-full flex flex-col ">
                  {/* First Box above amortization table */}
                  <div className="w-full h-auto flex flex-col border-gray-300 border p-2">
                    {/* Down Payment */}
                    {singleCar?.price && (
                      <div className={`w-full flex items-center ${errorDownPayment ? "mb-[55px] !text-red-500" : "mb-2"}`}>
                        <h1 className="mr-2">Down Payment:</h1>
                        <div className="w-[40%] relative flex flex-col ">
                          <NumericFormat
                            customInput={TextField}
                            prefix={"$"}
                            thousandSeparator={true}
                            className="h-[38px] outline-none border border-red-500 indent-1 rounded-sm mr-2 "
                            autoComplete="off"
                            max="6"
                            value={downPayment}
                            onChange={(e) => {
                              dispatch(setDownPayment({ max: singleCar?.price, value: e.target.value }));
                            }}
                          />

                          {/* Error State */}
                          {errorDownPayment && <span className=" absolute top-10 text-[12px] text-red-500 font-semibold">Your down payment is larger than the loan amount</span>}
                        </div>
                      </div>
                    )}

                    {/* Loan Amount */}
                    <div className="w-full flex items-center my-2">
                      <h1 className="mr-2">Loan Amount:</h1>
                      <input
                        type="text"
                        readOnly
                        value={USDollar.format(Number(loanAmount.toFixed(2)))}
                        autoComplete="off"
                        className="indent-1 rounded-sm w-[40%] border border-gray-300 h-[38px] outline-none"
                      />
                    </div>

                    {/* Loan Term */}
                    <div className="w-full flex items-center my-2">
                      <h1 className="mr-2">Loan Term (months):</h1>

                      <select
                        name=""
                        id=""
                        className="outline-none border border-gray-400 indent-1 rounded-sm min-w-[70px] h-[38px] mr-2"
                        value={months}
                        onChange={(e) => {
                          dispatch(setMonths(e.target.value));
                        }}
                      >
                        <option value={36}>36</option>
                        <option value={48}>48</option>
                        <option value={60}>60</option>
                        <option value={72}>72</option>
                        <option value={84}>84</option>
                      </select>
                    </div>

                    {/* Interest Rate */}
                    <div className="w-full flex items-center my-2">
                      <h1 className="mr-2">Interest Rate:</h1>
                      <NumericFormat
                        customInput={TextField}
                        decimalScale={2}
                        suffix={"%"}
                        fixedDecimalScale
                        className="h-[38px] outline-none border border-gray-400 indent-1 rounded-sm w-[40%] mr-2 "
                        autoComplete="off"
                        value={interestRate}
                        onChange={(e) => {
                          dispatch(setInterestRate(e.target.value));
                        }}
                      />
                      {/* <input type="number"  value={interestRate}   autoComplete="off" className="indent-1 rounded-sm w-[40%] border border-gray-300 h-[38px] outline-none" onChange={(e) => {
                          dispatch(setInterestRate(e.target.value));
                        }}/> */}
                    </div>

                    {/* Button */}
                    <button
                      type="button"
                      className="w-full p-1 bg-black text-white rounded-xl h-[50px] my-3"
                      onClick={() => {
                        handleSubmit();
                        getLoansAtDiffrentMonths();
                      }}
                    >
                      Calculate
                    </button>

                    {/* Reset Button */}
                    {loanData && (
                      <button
                        type="button"
                        className="w-full p-1 bg-gray-300 border border-black text-black rounded-xl h-[50px] mb-3"
                        onClick={() => {
                          dispatch(resetItemDetailsState());
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Amortization Table */}
                  {loanData && (
                    <div className="w-full h-auto my-10 flex flex-col">
                      <h1 className="flex items-center justify-center w-full mb-2">
                        Total of {months} payments: {USDollar.format(grabMonthlyPayments(loanData)?.totalPaid.toFixed(2))}{" "}
                      </h1>
                      <AmortizationItemDetails data={loanData} />
                    </div>
                  )}
                </div>

                {/* Right Side */}
                <div className="h-auto w-full flex flex-col   ">
                  {/* Content */}
                  {/* If there is a loan data a user types in we render data otherwise we render the regaulr values */}
                  {loanData ? (
                    <div className="w-full h-auto flex flex-col items-center p-2">
                      <h1 className="text-[25px] bg-black text-white px-1 mb-3">
                        Monthly Payment: <span>{USDollar.format(grabMonthlyPayments(loanData)?.monthlyP.toFixed(2))}</span>
                      </h1>

                      {/* Pie Chart */}
                      {loanData && (
                        <div className="w-full h-auto items-center justify-center flex ">
                          <LoanPieChart data={loanData} />
                        </div>
                      )}

                      {/* Totals */}
                      <div className="w-full h-auto justify-center flex items-center  flex-col my-10">
                        <Tooltip
                          title={`Loan Amount ${USDollar.format(grabMonthlyPayments(loanData)?.loanAmount.toFixed(2))} + Interest ${USDollar.format(
                            grabMonthlyPayments(loanData)?.totalInterest.toFixed(2)
                          )}`}
                          placement="top"
                        >
                          <div className="w-[70%] flex items-center h-auto font-medium cursor-pointer">
                            <h1 className="w-full border bg-gray-200 border-gray-400 py-[1px] px-1">Total of {months} payments</h1>
                            <h1 className="w-full border-r border-t bg-gray-200 border-b border-gray-400 py-[1px] px-1">{USDollar.format(grabMonthlyPayments(loanData)?.totalPaid.toFixed(2))}</h1>
                          </div>
                        </Tooltip>

                        <div className="w-[70%] flex items-center h-auto font-medium ">
                          <h1 className="w-full border-r border-l border-b border-gray-400 py-[1px] px-1">Total Interest</h1>
                          <h1 className="w-full border-r   border-b border-gray-400 py-[1px] px-1">{USDollar.format(grabMonthlyPayments(loanData)?.totalInterest.toFixed(2))}</h1>
                        </div>

                        {StaticDownPayment > 0 && (
                          <div className="w-[70%] flex items-center h-auto font-medium ">
                            <h1 className="w-full border bg-gray-200 border-gray-400 py-[1px] px-1">-</h1>
                            <h1 className="w-full border-r border-t bg-gray-200 border-b border-gray-400 py-[1px] px-1">-</h1>
                          </div>
                        )}

                        {StaticDownPayment > 0 && (
                          <div className="w-[70%] flex items-center h-auto font-medium ">
                            <h1 className="w-full border-r border-l border-b border-gray-400 py-[1px] px-1">Down Payment</h1>
                            <h1 className={`w-full border-r   border-b border-gray-400 py-[1px] px-1 `}>{USDollar.format(StaticDownPayment)}</h1>
                          </div>
                        )}

                        {StaticDownPayment > 0 && (
                          <div className="w-[70%] flex items-center h-auto font-medium ">
                            <h1 className="w-full border bg-green-200 border-gray-400 py-[1px] px-1">Total</h1>
                            <h1 className="w-full border-r border-t bg-green-200 border-b border-gray-400 py-[1px] px-1 font-semibold ">{TotalPrice}</h1>
                          </div>
                        )}
                      </div>

                      {/* Compares */}
                      <div className="w-full min-h-[350px] bg-gray-100 border border-gray-200 rounded-xl boxShadow">
                        <div className="w-full h-auto flex flex-col p-2 justify-center items-center">
                          {compareData?.map((item: any, index: any) =>
                            item?.month === months ? (
                              <span key={index}></span>
                            ) : (
                              <div key={index} className="w-full h-auto flex flex-col justify-center items-center my-4">
                                <h1 className="mb-1">
                                  Loan Term <span className="font-semibold underline">{item?.month} months</span>
                                </h1>
                                <h1 className="my-[1px]">
                                  Total of {item?.month} payments: <span>{USDollar.format(item?.obj?.sum.toFixed(2))}</span>
                                </h1>
                                <h1 className="my-[1px]">
                                  Total Interest: <span>{USDollar.format(item?.obj?.interestSum.toFixed(2))}</span>
                                </h1>
                                <h1 className="my-[1px]">
                                  Monthly Payment: <span>{USDollar.format(grabMonthlyPayments(item?.obj)?.monthlyP)}</span>
                                </h1>

                                {Math.sign(grabMonthlyPayments(loanData)?.totalPaid.toFixed(2) - item?.obj?.sum.toFixed(2)) === 1 ? (
                                  <p className="text-green-600 text-[19px] font-semibold mt-2 underline">
                                    {`You will save ${USDollar.format(grabMonthlyPayments(loanData)?.totalPaid.toFixed(2) - item?.obj?.sum.toFixed(2))}`}
                                  </p>
                                ) : Math.sign(grabMonthlyPayments(loanData)?.totalPaid.toFixed(2) - item?.obj?.sum.toFixed(2)) === -1 ? (
                                  <p className="text-red-600 text-[19px] font-semibold mt-2 underline">
                                    {`You will lose ${USDollar.format(grabMonthlyPayments(loanData)?.totalPaid.toFixed(2) - item?.obj?.sum.toFixed(2))}`}
                                  </p>
                                ) : (
                                  "Equal"
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    typeof singleCar?.price === "number" && (
                      <div className="w-full h-auto flex flex-col items-center p-2">
                        <h1 className="text-[25px] bg-black text-white px-1 mb-3">
                          Monthly Payment: <span>{USDollar.format(grabMonthlyPayments(onRenderLoan())?.monthlyP.toFixed(2))}</span>
                        </h1>

                        {/* Pie Chart */}
                        {onRenderLoan() && (
                          <div className="w-full h-auto flex ">
                            <LoanPieChart data={onRenderLoan()} />
                          </div>
                        )}

                        {/* Totals */}
                        <div className="w-full h-auto justify-center flex items-center  flex-col my-10">
                          <div className="w-[70%] flex items-center h-auto font-medium ">
                            <h1 className="w-full border bg-gray-200 border-gray-400 py-[1px] px-1">Total of {months} payments</h1>
                            <h1 className="w-full border-r border-t bg-gray-200 border-b border-gray-400 py-[1px] px-1">
                              {USDollar.format(grabMonthlyPayments(onRenderLoan())?.totalPaid.toFixed(2))}
                            </h1>
                          </div>

                          <div className="w-[70%] flex items-center h-auto font-medium ">
                            <h1 className="w-full border-r border-l border-b border-gray-400 py-[1px] px-1">Total Interest</h1>
                            <h1 className="w-full border-r   border-b border-gray-400 py-[1px] px-1">{USDollar.format(grabMonthlyPayments(onRenderLoan())?.totalInterest.toFixed(2))}</h1>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          // Similar Cars
          <div className="w-full h-auto flex flex-col mt-[150px] ">
            <h1 className="w-full flex justify-center text-[40px] font-semibold mb-3 underline">Similar Cars</h1>

            {/* Mapped Data */}
            <div className="grid grid-cols-3 2xl:grid-cols-4 gap-2 w-full h-auto">
              {Array.from(Array(8).keys()).map((item: any, index: any) => (
                <Skeleton key={index} variant="rectangular" className="w-full h-[300px]" />
              ))}
            </div>
          </div>
        ) : (
          // Similar Cars
          <div className="w-full h-auto flex flex-col mt-[150px] ">
            <h1 className="w-full flex justify-center text-[40px] font-semibold mb-3 underline">Similar Cars</h1>

            {/* Mapped Data */}
            <div className="grid grid-cols-3 2xl:grid-cols-4 gap-2 w-full h-auto">
              {similarCarsData?.map((item: any, index: any) => (item.type === "Carvana Certified" ? <CarVanaCard item={item} key={index} /> : <CarDotComCard item={item} key={index} />))}
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------------------------------------------------------------------- */}

      {/* Mobile Content */}
      <div className="w-full h-auto lg:hidden flex flex-col mb-20 sm:p-10 p-4">
        {/* First Box */}
        <div className="w-full flex flex-col items-center justify-center">
          {/* Img */}
          <img src={singleCar?.img} alt="Car Cover" className="lg:w-[450px] md:w-[450px] sm:w-[350px] w-[300px] object-cover rounded-2xl" loading="lazy" onLoad={imageOnLoad} onError={imageOnError} />

          {/* Right Side Facts About Car */}
          <div className="w-full flex flex-col  items-center justify-center mt-2  p-2 rounded-2xl">
            {/* Name */}
            <div className="flex items-center mb-1">
              <h1 className="mr-1 italic">Name:</h1>
              <h1 className="font-semibold">{singleCar?.name_modal}</h1>
            </div>

            {/* Price */}
            <div className="flex items-center my-1">
              <h1 className="mr-1 italic">Price:</h1>
              <h1 className="font-semibold">{singleCar?.price ? USDollar.format(Number(singleCar?.price.toFixed())) : "null"}</h1>
            </div>

            {/* mileage */}
            <div className="flex items-center my-1">
              <h1 className="mr-1 italic">Mileage:</h1>
              <h1 className="font-semibold">{singleCar?.mileage ? `${new Intl.NumberFormat().format(Number(singleCar?.mileage))} miles` : "null"}</h1>
            </div>

            {/* mileage */}
            <div className="flex items-center my-1">
              <h1 className="mr-1 italic">From:</h1>
              <h1 className="font-semibold">{singleCar?.type}</h1>
            </div>

            {/* mileage */}
            <div className="flex items-center my-1 w-[50%]">
              <p className="text-[9px] text-gray-500">If theres no image don't worry, some of these cars will be outdated and all it takes is my monthly update and everything will be good</p>
            </div>
          </div>
        </div>

          {/* Credit */}
        <div className="w-full h-auto flex flex-col mt-10">
            <h1 className="w-full flex justify-center text-[22px] sm:text-[30px] underline font-semibold mb-2">Credit</h1>

            <p className="text-[14px] sm:text-base indent-5 mb-2">
              "When you’re getting ready to finance a new or used car, knowing the average car loan interest rate received by other recent car buyers is helpful. Having this information, especially
              for borrowers with a credit score similar to yours, gives you an idea of what rate to expect and a benchmark for comparing loan offers. The auto loan interest rate you receive is based
              on several factors — such as your income, credit history and credit score. Your credit score is one of the biggest factors in determining the rate you’ll get, because lenders use it to
              gauge how likely you are to repay the loan. Generally speaking, the higher your credit score, the lower your car loan interest rate is likely to be." -{" "}
              <span className=" italic text-blue-500 font-medium cursor-pointer">
                <Link target="_blank" to="https://www.nerdwallet.com/article/loans/auto-loans/average-car-loan-interest-rates-by-credit-score">
                  NerdWallet
                </Link>
              </span>
            </p>

            <h1 className="w-full flex justify-center underline text-[17px] sm:text-[20px] mt-8 mb-2">Average car loan interest rates by credit score</h1>
            <CreditTable />
          </div>

        {/* Amortization Stuff */}
        <div className="w-full h-auto flex flex-col mt-10">
          <h1 className="w-full flex justify-center text-[22px] sm:text-[30px] underline font-semibold mb-2">Amorization Schedule</h1>

          <p className="indent-5 mb-2 ttext-[14px] sm:text-base">
            Consumer credit reporting company Experian releases average auto loan interest rates in its quarterly Automotive Finance Market report. In the third quarter of 2023, the overall average
            auto loan interest rate was 7.03% for new cars and 11.35% for used cars. -{" "}
            <span className=" italic text-blue-500 font-medium cursor-pointer">
              <Link target="_blank" to="https://www.nerdwallet.com/article/loans/auto-loans/average-car-loan-interest-rates-by-credit-score">
                NerdWallet
              </Link>
            </span>
          </p>
          <p className="indent-5">
            Since the average interest rate for used cars is 11.35%, we will set the interest rate at that. However, feel free to change it and apply an interest rate to your pleasing.
          </p>

          {/* Content For Tables and Pie Chart */}
          <div className="w-full h-auto flex flex-col mt-[55px]">


            {/* Inputs and Pie CHart */}
            <div className="w-full flex h-auto flex-col">


              {/* Calculate Monthly Payments */}
              <div className="min-h-[250px] w-full flex flex-col items-center justify-center mb-10">
                {/* First Box above amortization table */}
                <div className="sm:w-[80%] w-full h-auto flex  flex-col border-gray-300 border p-5 rounded-lg">


                  {/* Down Payment */}
                  {singleCar?.price && (
                    <div className={`w-full flex items-center justify-center ${errorDownPayment ? "mb-[55px] !text-red-500" : "mb-2"}`}>
                      <h1 className="mr-2 text-[14px]">Down Payment:</h1>
                      <div className=" relative flex flex-col ">
                        <NumericFormat
                          customInput={TextField}
                          prefix={"$"}
                          thousandSeparator={true}
                          className="h-[38px] outline-none border border-red-500 indent-1 rounded-sm mr-2 "
                          autoComplete="off"
                          max="6"
                          value={downPayment}
                          onChange={(e) => {
                            dispatch(setDownPayment({ max: singleCar?.price, value: e.target.value }));
                          }}
                        />

                        {/* Error State */}
                        {errorDownPayment && <span className=" absolute top-10 text-[12px] text-red-500 font-semibold">Your down payment is larger than the loan amount</span>}
                      </div>
                    </div>
                  )}


                  {/* Loan Amount */}
                  <div className="w-full flex items-center justify-center my-2">
                    <h1 className="mr-2 text-[14px]">Loan Amount:</h1>
                    <input
                      type="text"
                      readOnly
                      value={USDollar.format(Number(loanAmount.toFixed(2)))}
                      autoComplete="off"
                      className="indent-1 rounded-sm  border border-gray-300 h-[38px] outline-none"
                    />
                  </div>

                  {/* Loan Term */}
                  <div className="w-full flex items-center justify-center my-2">
                    <h1 className="mr-2 text-[14px]">Loan Term (months):</h1>

                    <select
                      name=""
                      id=""
                      className="outline-none border border-gray-400 indent-1 rounded-sm min-w-[70px] h-[38px] mr-2"
                      value={months}
                      onChange={(e) => {
                        dispatch(setMonths(e.target.value));
                      }}
                    >
                      <option value={36}>36</option>
                      <option value={48}>48</option>
                      <option value={60}>60</option>
                      <option value={72}>72</option>
                      <option value={84}>84</option>
                    </select>
                  </div>

                  {/* Interest Rate */}
                  <div className="w-full flex items-center justify-center my-2">
                    <h1 className="mr-2 text-[14px]">Interest Rate:</h1>
                    <NumericFormat
                      customInput={TextField}
                      decimalScale={2}
                      suffix={"%"}
                      fixedDecimalScale
                      className="h-[38px] outline-none border border-gray-400 indent-1 rounded-sm  mr-2 "
                      autoComplete="off"
                      value={interestRate}
                      onChange={(e) => {
                        dispatch(setInterestRate(e.target.value));
                      }}
                    />
                    {/* <input type="number"  value={interestRate}   autoComplete="off" className="indent-1 rounded-sm w-[40%] border border-gray-300 h-[38px] outline-none" onChange={(e) => {
                          dispatch(setInterestRate(e.target.value));
                        }}/> */}
                  </div>

                  {/* Button */}
                  <button
                    type="button"
                    className="w-full p-1 bg-black text-white rounded-xl h-[50px] my-3"
                    onClick={() => {
                      handleSubmit();
                      getLoansAtDiffrentMonths();
                    }}
                  >
                    Calculate
                  </button>

                  {/* Reset Button */}
                  {loanData && (
                    <button
                      type="button"
                      className="w-full p-1 bg-gray-300 border border-black text-black rounded-xl h-[50px] mb-3"
                      onClick={() => {
                        dispatch(resetItemDetailsState());
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Amortization Table */}
                {loanData && (
                  <div className="w-full h-auto my-10 flex flex-col">
                    <h1 className="flex items-center justify-center w-full mb-2">
                      Total of {months} payments: {USDollar.format(grabMonthlyPayments(loanData)?.totalPaid.toFixed(2))}{" "}
                    </h1>
                    <AmortizationItemDetails data={loanData} />
                  </div>
                )}
              </div>



              {/* Right Side */}
              <div className="h-auto w-full flex flex-col   ">
                {/* Content */}
                {/* If there is a loan data a user types in we render data otherwise we render the regaulr values */}
                {loanData ? (
                  <div className="w-full h-auto flex flex-col items-center p-2">
                    <h1 className="text-[25px] bg-black text-white px-1 mb-3">
                      Monthly Payment: <span>{USDollar.format(grabMonthlyPayments(loanData)?.monthlyP.toFixed(2))}</span>
                    </h1>

                    {/* Pie Chart */}
                    {loanData && (
                      <div className="w-full h-auto items-center justify-center flex ">
                        <LoanPieChart data={loanData} />
                      </div>
                    )}

                    {/* Totals */}
                    <div className="w-full h-auto justify-center flex items-center  flex-col my-10">
                      <Tooltip
                        title={`Loan Amount ${USDollar.format(grabMonthlyPayments(loanData)?.loanAmount.toFixed(2))} + Interest ${USDollar.format(
                          grabMonthlyPayments(loanData)?.totalInterest.toFixed(2)
                        )}`}
                        placement="top"
                      >
                        <div className="w-[70%] flex items-center h-auto font-medium cursor-pointer">
                          <h1 className="w-full border bg-gray-200 border-gray-400 py-[1px] px-1">Total of {months} payments</h1>
                          <h1 className="w-full border-r border-t bg-gray-200 border-b border-gray-400 py-[1px] px-1">{USDollar.format(grabMonthlyPayments(loanData)?.totalPaid.toFixed(2))}</h1>
                        </div>
                      </Tooltip>

                      <div className="w-[70%] flex items-center h-auto font-medium ">
                        <h1 className="w-full border-r border-l border-b border-gray-400 py-[1px] px-1">Total Interest</h1>
                        <h1 className="w-full border-r   border-b border-gray-400 py-[1px] px-1">{USDollar.format(grabMonthlyPayments(loanData)?.totalInterest.toFixed(2))}</h1>
                      </div>

                      {StaticDownPayment > 0 && (
                        <div className="w-[70%] flex items-center h-auto font-medium ">
                          <h1 className="w-full border bg-gray-200 border-gray-400 py-[1px] px-1">-</h1>
                          <h1 className="w-full border-r border-t bg-gray-200 border-b border-gray-400 py-[1px] px-1">-</h1>
                        </div>
                      )}

                      {StaticDownPayment > 0 && (
                        <div className="w-[70%] flex items-center h-auto font-medium ">
                          <h1 className="w-full border-r border-l border-b border-gray-400 py-[1px] px-1">Down Payment</h1>
                          <h1 className={`w-full border-r   border-b border-gray-400 py-[1px] px-1 `}>{USDollar.format(StaticDownPayment)}</h1>
                        </div>
                      )}

                      {StaticDownPayment > 0 && (
                        <div className="w-[70%] flex items-center h-auto font-medium ">
                          <h1 className="w-full border bg-green-200 border-gray-400 py-[1px] px-1">Total</h1>
                          <h1 className="w-full border-r border-t bg-green-200 border-b border-gray-400 py-[1px] px-1 font-semibold ">{TotalPrice}</h1>
                        </div>
                      )}
                    </div>

                    {/* Compares */}
                    <div className="w-full min-h-[350px] bg-gray-100 border border-gray-200 rounded-xl boxShadow">
                      <div className="w-full h-auto flex flex-col p-2 justify-center items-center">
                        {compareData?.map((item: any, index: any) =>
                          item?.month === months ? (
                            <span key={index}></span>
                          ) : (
                            <div key={index} className="w-full h-auto flex flex-col justify-center items-center my-4">
                              <h1 className="mb-1">
                                Loan Term <span className="font-semibold underline">{item?.month} months</span>
                              </h1>
                              <h1 className="my-[1px]">
                                Total of {item?.month} payments: <span>{USDollar.format(item?.obj?.sum.toFixed(2))}</span>
                              </h1>
                              <h1 className="my-[1px]">
                                Total Interest: <span>{USDollar.format(item?.obj?.interestSum.toFixed(2))}</span>
                              </h1>
                              <h1 className="my-[1px]">
                                Monthly Payment: <span>{USDollar.format(grabMonthlyPayments(item?.obj)?.monthlyP)}</span>
                              </h1>

                              {Math.sign(grabMonthlyPayments(loanData)?.totalPaid.toFixed(2) - item?.obj?.sum.toFixed(2)) === 1 ? (
                                <p className="text-green-600 text-[19px] font-semibold mt-2 underline">
                                  {`You will save ${USDollar.format(grabMonthlyPayments(loanData)?.totalPaid.toFixed(2) - item?.obj?.sum.toFixed(2))}`}
                                </p>
                              ) : Math.sign(grabMonthlyPayments(loanData)?.totalPaid.toFixed(2) - item?.obj?.sum.toFixed(2)) === -1 ? (
                                <p className="text-red-600 text-[19px] font-semibold mt-2 underline">
                                  {`You will lose ${USDollar.format(grabMonthlyPayments(loanData)?.totalPaid.toFixed(2) - item?.obj?.sum.toFixed(2))}`}
                                </p>
                              ) : (
                                "Equal"
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  typeof singleCar?.price === "number" && (
                    <div className="w-full h-auto flex flex-col items-center p-2">
                      <h1 className="text-[25px] bg-black text-white px-1 mb-3">
                        Monthly Payment: <span>{USDollar.format(grabMonthlyPayments(onRenderLoan())?.monthlyP.toFixed(2))}</span>
                      </h1>

                      {/* Pie Chart */}
                      {onRenderLoan() && (
                        <div className="w-full h-auto flex ">
                          <LoanPieChart data={onRenderLoan()} />
                        </div>
                      )}

                      {/* Totals */}
                      <div className="w-full h-auto justify-center flex items-center  flex-col my-10">
                        <div className="w-[70%] flex items-center h-auto font-medium ">
                          <h1 className="w-full border bg-gray-200 border-gray-400 py-[1px] px-1">Total of {months} payments</h1>
                          <h1 className="w-full border-r border-t bg-gray-200 border-b border-gray-400 py-[1px] px-1">{USDollar.format(grabMonthlyPayments(onRenderLoan())?.totalPaid.toFixed(2))}</h1>
                        </div>

                        <div className="w-[70%] flex items-center h-auto font-medium ">
                          <h1 className="w-full border-r border-l border-b border-gray-400 py-[1px] px-1">Total Interest</h1>
                          <h1 className="w-full border-r   border-b border-gray-400 py-[1px] px-1">{USDollar.format(grabMonthlyPayments(onRenderLoan())?.totalInterest.toFixed(2))}</h1>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

// 877 662 7447
// w05c776274