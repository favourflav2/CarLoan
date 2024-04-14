import * as React from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { motion } from "framer-motion";
import { Dispatch } from "../../../redux/store";
import { setAnyTypeOfModal } from "../../../redux/features/applicationSlice";

export interface IRetire1stProps {}

export default function Retire1st(props: IRetire1stProps) {
  // Redux States
  const dispatch = Dispatch();

  // ref for scrolling to top
  const myRef = React.useRef<any>(null);
  const executeScroll = () => myRef?.current?.scrollTo(0, 0);

  React.useEffect(() => {
    executeScroll();
  }, []);
  return (
    <motion.div
      className="w-full h-full  flex flex-col  text-lightText dark:text-darkText"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: 0.3,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      ref={myRef}
    >
      {/* First Box */}
      <div className="w-full justify-between flex items-center ">
        <h1 className=" text-[22px] font-medium">Retirement</h1>
        <CloseOutlinedIcon onClick={() => dispatch(setAnyTypeOfModal({ value: false, type: "Retirement" }))} className=" cursor-pointer"/>
      </div>

      <hr className="my-2 border dark:border-darkText border-lightText" />

      {/* Second Box */}
      <div className="w-full flex flex-col h-auto">
        <h1 className="text-[19px] font-semibold">About Retirement</h1>

        <p className="text-[15px] sm:leading-7 mt-1">
          Retirement is supposed to be a great part of one's life, but understanding and planning for it may be a probem. Without knowing how long retirement will last, you have to decide when to
          leave work, where to live, how to spend your days—and what it all will cost.{" "}
        </p>

        <ol>
          <div className="w-auto flex flex-col mb-2">
            <h1 className="text-[19px] font-semibold mt-4 mb-1">1. 80% Rule</h1>
            <p className="text-[15px] sm:leading-7 ">
              This rule of thumb suggests that you'll have to ensure you have 80% of your pre-retirement income per year in retirement. This percentage is based on the fact that some major expenses
              drop after you retire, like commuting and retirement-plan contributions. Of course, other expenses may go up such as vacation travel and, inevitably, health care.
            </p>
          </div>

          <div className="w-auto flex flex-col mb-2">
            <h1 className="text-[19px] font-semibold mt-4 mb-1">2. 10x your annual salary by 67</h1>
            <p className="text-[15px] sm:leading-7 ">
              In general, you should aim to have 10 times your preretirement income saved by the time you reach age 67, according to Fidelity. That means that, theoretically, someone with a $100,000
              salary should have $1 million saved by the time they retire.
            </p>
          </div>

          <div className="w-auto flex flex-col mb-2">
            <h1 className="text-[19px] font-semibold mt-4 mb-1">2. The 4% rule</h1>
            <p className="text-[15px] sm:leading-7 ">
              The 4% rule limits annual withdrawals from your retirement accounts to 4% of the total balance in your first year of retirement. That means if you retire with $1 million saved, you’d
              take out $40,000. According to the rule, this amount is safe enough that you won’t risk running out of money during a 30-year retirement
            </p>
          </div>
        </ol>
      </div>
    </motion.div>
  );
}
