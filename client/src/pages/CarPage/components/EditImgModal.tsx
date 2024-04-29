import * as React from 'react';
import { Modal } from "@mui/material";
import ImageCrop from '../../../components/ImageCropper/ImageCropper';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { motion } from "framer-motion";

export interface IEditImgModalProps {
    setOpenImgModal: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;

  updateImg(img: string): void;
}

export default function EditImgModal ({ setOpenImgModal, open, updateImg }: IEditImgModalProps) {
    // ref for scrolling to top
  const myRef = React.useRef<any>(null);
  const executeScroll = () => myRef?.current?.scrollTo(0, 0);

  React.useEffect(() => {
    executeScroll();
  }, []);
  return (
    <Modal open={open} onClose={() => setOpenImgModal(false)}>
      {/* Container */}
      <div className=" absolute top-[50%] left-[50%] transfrom -translate-x-[50%] -translate-y-[50%]  dark:bg-homeBg bg-lightHomeBg sm:w-[70%] md:w-[60%] xl:w-[50%] 2xl:w-[45%] w-full h-full  rounded-lg p-4">
        {/* Content */}
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
            <h1 className=" text-[22px] font-medium">Select New Image</h1>
            <CloseOutlinedIcon onClick={() => setOpenImgModal(false)} className=' cursor-pointer'/>
          </div>

          <hr className="my-2 border dark:border-darkText border-lightText" />

          <ImageCrop updateImg={updateImg} setOpenImgModal={setOpenImgModal} type="Edit"/>
        </motion.div>
      </div>
    </Modal>
  );
}
