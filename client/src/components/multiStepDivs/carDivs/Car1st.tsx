import * as React from "react";
import { Dispatch } from "../../../redux/store";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { motion } from "framer-motion";
import { setAnyTypeOfModal } from "../../../redux/features/applicationSlice";
import EditIcon from "@mui/icons-material/Edit";
import insertCar from "../../../assets/addImg.png";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Car1stInputs from "./CarComponets/Car1stInputs";
import CarImgModal from "./CarComponets/CarImgModal";

export default function Car1st() {
  // Redux States
  const dispatch = Dispatch();

  // File Uploader
  const [updatedImg, setUpdatedImg] = React.useState("");

  // Modal States
  const [openImgModal, setOpenImgModal] = React.useState(false);

  function updateImg(img: string) {
    setUpdatedImg(img);
  }







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

    >
      {/* First Box */}
      <div className="w-full justify-between flex items-center ">
        <h1 className=" text-[22px] font-medium">Car</h1>
        <CloseOutlinedIcon onClick={() => dispatch(setAnyTypeOfModal({ value: false, type: "Car" }))} />
      </div>

      <hr className="my-2 border dark:border-darkText border-lightText" />

      {/* Add Car */}
      <div className="w-auto flex flex-col h-auto ">
        <div className="w-[240px] h-[205px] relative flex items-center">
          <img src={updatedImg ? updatedImg : insertCar} alt="" className="w-[200px] h-[200px] " />
          {/* Add Photo and Edit Icon */}
          <div className={`${updatedImg ? "right-[30px] top-[1px]" : "right-8 bottom-0"} absolute  bg-gray-600 text-white rounded-full p-[2px] cursor-pointer`} onClick={() => setOpenImgModal(true)}>
            {updatedImg ? <EditIcon className="p-[2px]" /> : <AddAPhotoIcon className="p-[4px]" />}
          </div>
        </div>
      </div>

      {/* Form */}
      <Car1stInputs updatedImg={updatedImg}/>
      <CarImgModal open={openImgModal} updateImg={updateImg} setOpenImgModal={setOpenImgModal} />
    </motion.div>
  );
}
