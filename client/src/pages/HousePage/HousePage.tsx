import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { setSelectedGoal } from "../../redux/features/applicationSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import HousePageInputs from "./HousePageInputs";
import EditNameHouseBox from "./EditNameHouseBox";
import HouseImgAndNum from "./HouseImgAndNum";
import { getMonthlyPaymentForHouse } from "../../components/helperFunctions/loanfunctions/HouseLoanFuntion";

export interface IHousePageProps {}

const schema = z.object({
  streetAddress: z
    .string({
      required_error: "Please enter a name",
    })
    .max(50, {
      message: "Max length is 50",
    })
    .min(4, {
      message: "Min length is 4",
    }),
});

type FormFields = z.infer<typeof schema>;

export default function HousePage(props: IHousePageProps) {
  // Redux States
  const { selectedGoal, shrinkDashboardSidebar } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // Form Feilds
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<FormFields>({
    mode: "onChange",
    defaultValues: {
      streetAddress: selectedGoal && selectedGoal.type === "House" ? selectedGoal.streetAddress : "",
    },
    resolver: zodResolver(schema),
  });

  // Edit State
  const [editState, setEditState] = React.useState(false);
  const [saveBtn, setSaveBtn] = React.useState(false);

  // Modal States
  const [openImgModal, setOpenImgModal] = React.useState(false);

  React.useEffect(() => {
    if (!selectedGoal || selectedGoal.type !== "House") return;
    const { interest, downPayment, insurance, mortgageInsurance, propertyTax, price, term } = selectedGoal;
    getMonthlyPaymentForHouse({ rate: interest, time: term, downPayment, price, propertyTax, insurance, mortgageInsurance }, 0);
  }, [selectedGoal]);

  // Handle Submit
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    // dispatch(editRetireGoalTitle({ id, newTitle: data?.title, goal: selectedGoal }));
    // dispatch(editSelectedGoalTitle({ title: data?.title, goal: selectedGoal }));
    // setEditState(false);
    // setSaveBtn(false);
  };

  if (!selectedGoal || selectedGoal.type !== "House") {
    dispatch(setSelectedGoal(null));
    return null;
  }
  return (
    <div className="w-full h-full flex flex-col min-[900px]:px-0 px-4">
      {/* Top Section Chart and Inputs */}
      <div
        className={`w-full h-full grid ${
          shrinkDashboardSidebar ? "lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] min-[880px]:grid-cols-[250px_1fr] grid-cols-1" : "lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] grid-cols-1"
        }`}
      >
        {/* Left Side Inputs */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGoal ? selectedGoal?.streetAddress : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-h-[900px]"
          >
            <HousePageInputs />
          </motion.div>
        </AnimatePresence>

        {/* Right Side Chart */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGoal ? selectedGoal?.streetAddress : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col dark:text-gray-300 text-black p-4"
          >
            {/* Street Address / Title */}
            <EditNameHouseBox
              register={register}
              onSubmit={onSubmit}
              setValue={setValue}
              editState={editState}
              setEditState={setEditState}
              handleSubmit={handleSubmit}
              saveBtn={saveBtn}
              errors={errors}
            />

            {/* House Img and Numbers */}
            <HouseImgAndNum selectedGoal={selectedGoal} setOpenImgModal={setOpenImgModal} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
