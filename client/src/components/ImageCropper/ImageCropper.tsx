import * as React from "react";
//import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
//import { motion } from "framer-motion";
import ReactCrop, { type Crop, makeAspectCrop, centerCrop, convertToPixelCrop } from "react-image-crop";
import UploadIcon from "@mui/icons-material/Upload";

const MIN_DIMENSION = 200;
export default function ImageCrop() {
  // File Uploader
  const [file, setFile] = React.useState<string>();
  const [crop, setCrop] = React.useState<Crop | any>();
  const [error, setError] = React.useState("");
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

  return (
    <div className="w-full h-auto flex flex-col">
      <div className="w-[300px] flex flex-col h-auto mt-3">
        {file ? (
          <div className="w-full h-full flex flex-col">
            <ReactCrop
              crop={crop}
              keepSelection
              aspect={1}
              minWidth={MIN_DIMENSION}
              onChange={(pixelCrop) => {
                setCrop(pixelCrop);
              }}
            >
              <img src={file} alt="" className={`w-full h-[200px] `} onLoad={onImgLoad} ref={refImg} />
            </ReactCrop>
            <button
              className="my-2 bg-green-800 text-white rounded-md"
              onClick={() => {
                if (refImg?.current?.height && refImg?.current?.width) {
                  setCanvasPreview(refImg.current, refPreview.current, convertToPixelCrop(crop, refImg?.current?.width, refImg?.current?.height));

                  const dataUrl = refPreview?.current?.toDataURL();
                  console.log(dataUrl);
                }
              }}
            >
              Crop Image
            </button>
          </div>
        ) : (
          <div className=" w-full h-[200px] flex flex-col border-dashed border-2 border-chartGreen dark:border-darkText" onClick={chooseImg}>
            <div className="w-full h-full flex items-center justify-center flex-col">
              <button className="text-chartGreen bg-green-100 dark:bg-darktext dark:text-lightText p-2 rounded-full mb-4">
                <UploadIcon className="text-[35px]" />
              </button>
              <h1 className="text-chartGreen dark:text-darkText">Upload File</h1>
            </div>
          </div>
        )}
        <input type="file" accept="image/*" onChange={getFiles} className="hidden" ref={fileRef} />
        {file ? (
          <button className="p-1 rounded-lg mt-3 bg-red-400   text-white transition ease-in-out delay-150  hover:scale-95 duration-300" onClick={()=>{
            setFile("")
          }}>
            Remove
          </button>
        ) : (
          <button className="p-1 rounded-lg mt-3 bg-chartGreen dark:bg-darkText dark:text-lightText text-white transition ease-in-out delay-150  hover:scale-95 duration-300" onClick={chooseImg}>
            Upload
          </button>
        )}
      </div>
      {crop && <canvas className="mt-4 w-[200px] h-[200px] border-2 border-black" ref={refPreview}></canvas>}
    </div>
  );
}
