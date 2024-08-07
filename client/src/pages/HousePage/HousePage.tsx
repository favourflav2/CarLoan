import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { editSelectedGoalTitle, setSelectedGoal } from "../../redux/features/applicationSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import HousePageInputs from "./HousePageInputs";
import EditNameHouseBox from "./EditNameHouseBox";
import HouseImgAndNum from "./HouseImgAndNum";
import HouseChartContainer from "./HouseChartContainer";
import EditImgModal from "../CarPage/components/EditImgModal";
import { editHouseGoalTitle } from "../../redux/features/modalSlices/houseSlice";
import OpportunityCost from "./OppCost/OpportunityCost";
import useHouseFVFunctions from "./hooks/useHouseFVFunctions";
import { updateHouseGoalAddress } from "../../redux/asyncActions/houseActions";

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
  const { selectedGoal, shrinkDashboardSidebar} = UseSelector((state) => state.app);
  const { user } = UseSelector((state) => state.auth);
  const dispatch = Dispatch();

  const userId = user?.userObj.id;

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

  // File Uploader
  const [updatedImg, setUpdatedImg] = React.useState(""); // eslint-disable-line

  function updateImg(img: string) {
    setUpdatedImg(img);
  }

  // Modal States
  const [openImgModal, setOpenImgModal] = React.useState(false);

  // Chart State and Summary State
  const [view, setView] = React.useState<string>("Graph View");

  // Chart States using React use Memo
  const { monthlyPayment, regualrLoanAmmortization, extraNumberOfYears, extraLoanAmmortization } = useHouseFVFunctions();

  // Scroll to top on render
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, [selectedGoal?.id]);

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  React.useEffect(() => {
    const subscription = watch((data) => {
      if (selectedGoal?.type !== "House") return;
      if (data?.streetAddress !== selectedGoal?.streetAddress) {
        setSaveBtn(true);
      } else {
        setSaveBtn(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, saveBtn, selectedGoal]);

  // Makes Sure inputs match selected goal on page refresh
  React.useEffect(() => {
    if (selectedGoal && selectedGoal?.type === "House" && saveBtn === false) {
      reset({
        streetAddress: selectedGoal && selectedGoal.type === "House" ? selectedGoal.streetAddress : "",
      });
    }
    trigger();
  }, [selectedGoal, reset]); // eslint-disable-line

  // Handle Submit
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    if (!selectedGoal || selectedGoal?.type !== "House") return;

    if (userId) {
      // with user we send data to the backend
      dispatch(editSelectedGoalTitle({ title: data.streetAddress, goal: selectedGoal }));
      dispatch(updateHouseGoalAddress({ id: selectedGoal.id, newAddress: data.streetAddress }));
      setEditState(false);
      setSaveBtn(false);
    } else {
      // No user we use local storage
      dispatch(editHouseGoalTitle({ id: selectedGoal.id, newAddress: data.streetAddress, goal: selectedGoal }));
      dispatch(editSelectedGoalTitle({ title: data.streetAddress, goal: selectedGoal }));
      setEditState(false);
      setSaveBtn(false);
    }
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
          shrinkDashboardSidebar
            ? "lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] min-[880px]:grid-cols-[250px_1fr] grid-cols-1"
            : "lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] grid-cols-1"
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
            <HousePageInputs selectedGoal={selectedGoal} />
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

            {/* Chart Content */}
            {selectedGoal && monthlyPayment && (
              <HouseChartContainer
                view={view}
                setView={setView}
                selectedGoal={selectedGoal}
                monthlyPayment={monthlyPayment}
                regualrLoanAmmortization={regualrLoanAmmortization}
                extraNumberOfYears={extraNumberOfYears}
                extraLoanAmmortization={extraLoanAmmortization}
              />
            )}

            <EditImgModal updateImg={updateImg} setOpenImgModal={setOpenImgModal} open={openImgModal} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Opportunity Cost */}
      {selectedGoal && monthlyPayment && <OpportunityCost selectedGoal={selectedGoal} monthlyPayment={monthlyPayment} />}
    </div>
  );
}
