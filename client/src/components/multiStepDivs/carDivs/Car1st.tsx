import * as React from "react";
import { Dispatch } from "../../../redux/store";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { motion } from "framer-motion";
import { setAnyTypeOfModal } from "../../../redux/features/applicationSlice";
import AddIcon from '@mui/icons-material/Add';
import insertCar from "../../../assets/addImg.png";

import ReactCrop, { type Crop, makeAspectCrop, centerCrop, convertToPixelCrop } from "react-image-crop";
import ImageCrop from "../../ImageCropper/ImageCropper";
import Car1stInputs from "./CarComponets/Car1stInputs";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 200;

export default function Car1st() {
  // Redux States
  const dispatch = Dispatch();

  // File Uploader
  const [file, setFile] = React.useState<string>();
  const [crop, setCrop] = React.useState<Crop | any>();
  const [error, setError] = React.useState("");
  const [height, setHeight] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  const refImg = React.useRef(null as null | HTMLImageElement);
  const refPreview = React.useRef(null as null | HTMLCanvasElement);
  const fileRef = React.useRef(null as null | HTMLInputElement);

  // Helper Functions
  function getFiles(e: any) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();

      const imageUrl = reader.result?.toString() || "";

      imageElement.src = imageUrl;
      //Checking to make sure image is big enough
      imageElement.addEventListener("load", (e: any) => {
        if (error) {
          setError("");
        }
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalHeight < 150 || naturalWidth < 150) {
          return setError("error");
        }
      });
      setFile(imageUrl);
    });
    reader.readAsDataURL(file);
    //setFile(URL.createObjectURL(e.target.files[0]))
  }

  function chooseImg() {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }
  // 200
  function onImgLoad(e: any) {
    const { width, height } = e.currentTarget;
    const cropWidthIndex = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop(
      {
        // You don't need to pass a complete crop into
        // makeAspectCrop or centerCrop.
        unit: "%",
        width: cropWidthIndex,
      },
      1,
      width,
      height
    );
    const centerProp = centerCrop(crop, width, height);
    setCrop(centerProp);
  }

  function setCanvasPreview(image: any, canvas: any, crop: any) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    const pixelRatio = window.devicePixelRatio; // Keeps image looking good on 4k monitors
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothQuality = "high";

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    // Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY);
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);

    ctx.restore();
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
        <h1 className=" text-[22px] font-medium">Car</h1>
        <CloseOutlinedIcon onClick={() => dispatch(setAnyTypeOfModal({ value: false, type: "Car" }))} />
      </div>

      <hr className="my-2 border dark:border-darkText border-lightText" />

      {/* {error && <h1 className="mt-5">{error}</h1>} */}

      {/* Add Car */}
      <div className="w-auto flex flex-col h-auto">
        <img src={insertCar} alt="" className="w-[180px] h-[180px]"/>
       <button className="w-[180px] p-1 mt-2 dark:bg-darkText dark:text-lightText rounded-lg bg-chartGreen text-white ">Add Image</button>
      </div>

      {/* Form */}
      <Car1stInputs />
      
      
    </motion.div>
  );
}
