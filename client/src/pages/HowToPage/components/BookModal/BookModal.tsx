import { Modal } from "@mui/material";
import * as React from "react";
import { BooksArrayObj } from "../../../../redux/features/howToInvestSlice";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { LazyLoadImage } from "react-lazy-load-image-component";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export interface IBookModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpen: () => void;
  handleClose: () => void;
  item: BooksArrayObj;
}

export default function BookModal({ open, handleClose, handleOpen, item }: IBookModalProps) {

  return (
    <Modal open={open} onClose={handleClose}>
      <div className=" absolute top-[50%] text-lightText dark:text-darkText left-[50%] transfrom -translate-x-[50%] -translate-y-[50%]  dark:bg-homeBg bg-lightHomeBg sm:w-[450px] w-full sm:h-auto h-full  sm:rounded-lg border-[3px] border-gray-400 overflow-y-auto ">
        {/* Content */}
        <div className="w-full flex flex-col sm:py-4 px-4 py-2 ">
          {/* Clear Button */}
          <button className=" flex items-end justify-end" onClick={handleClose}>
            <ClearIcon />
          </button>
          {/* Book Data */}
          <div className="w-full flex flex-col mt-6">
            {/* Image */}
            <LazyLoadImage src={item.img} effect="blur" className="object-contain w-full sm:max-h-[250px] h-[170px] " />

            {/* Author & Title & Have Read */}
            <div className="w-full flex flex-col items-center justify-center">
              {/* Author */}
              <h1 className=" mb-1 mt-2 text-[13px] text-gray-400 dark:text-gray-300 font-semibold">{item.author}</h1>

              {/* Title */}
              <h1 className="  text-[15px]  ">{item.title}</h1>

              {/* Have Read */}
              <h1 className="text-[13px]">
                Read: {item.haveRead ? <CheckIcon className="text-[17px] text-chartGreen" /> : <ClearIcon className="text-[17px] text-red-500" />}
              </h1>
            </div>

            {/* About */}
            <p className="text-[12.5px] mt-3 leading-6">
              <span className="font-semibold">About:</span> {item.about}
            </p>
          </div>

          <div className="w-full flex flex-col items-center justify-center mt-4">

            <a href={item.amazonLink} target="_blank" rel="noreferrer noopener"><div className="flex cursor-pointer  items-centerw-[120px]  rounded-2xl items-center justify-center p-2  border border-chartGreen">
            <MenuBookIcon className="mb-[3px] text-[17px] mr-1 text-chartGreen dark:text-[RGBA(0, 163, 108, 0.2)]"/>
               <h1 className="text-[15px] text-chartGreen dark:text-[RGBA(0, 163, 108, 0.2)]">Read Now</h1>
            </div></a>

          </div>
        </div>
      </div>
    </Modal>
  );
}
