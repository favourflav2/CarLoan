import * as React from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { motion } from "framer-motion";
import insertCar from "../../../assets/addImg.png";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Dispatch } from "../../../redux/store";
import { setAnyTypeOfModal } from "../../../redux/features/applicationSlice";
import EditIcon from "@mui/icons-material/Edit";
import HouseFirstInputs from "./houseComponents/House1stInputs";
import SelectImgModal from "../../modals/SelectImgModal";

export interface IHouse1stProps {}


export default function House1st(props: IHouse1stProps) {
  // Redux States
  const dispatch = Dispatch();

  // File Uploader
  const [updatedImg, setUpdatedImg] = React.useState("");


  // Modal States
  const [openImgModal, setOpenImgModal] = React.useState(false); // eslint-disable-line

  function updateImg(img: string) {
    setUpdatedImg(img);
  }

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
        <h1 className=" text-[22px] font-medium">House</h1>
        <CloseOutlinedIcon onClick={() => dispatch(setAnyTypeOfModal({ value: false, type: "House" }))} />
      </div>

      <hr className="my-2 border dark:border-darkText border-lightText" />

      {/* Add House */}
      <div className="w-auto flex flex-col h-auto ">
        <div className="w-[240px] h-[205px] relative flex items-center">
          <img src={updatedImg ? updatedImg : insertCar} alt="" className="w-[200px] h-[200px] object-cover rounded-md" />
          {/* Add Photo and Edit Icon */}
          <div className={`${updatedImg ? "right-[30px] top-[1px]" : "right-8 bottom-0"} absolute  bg-gray-600 text-white rounded-full p-[2px] cursor-pointer`} onClick={() => setOpenImgModal(true)}>
            {updatedImg ? <EditIcon className="p-[2px]" /> : <AddAPhotoIcon className="p-[4px]" />}
          </div>
        </div>
      </div>

      {/* Form */}
       <HouseFirstInputs updatedImg={updatedImg}/> 

       {/* Img Modal */}
      <SelectImgModal open={openImgModal} updateImg={updateImg} setOpenImgModal={setOpenImgModal} /> 
    </motion.div>
  );
}
