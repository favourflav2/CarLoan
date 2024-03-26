import * as React from "react";
import setCanvasPreview from "./setCanvasPreview";
import ReactCrop, { type Crop, makeAspectCrop, centerCrop, convertToPixelCrop } from "react-image-crop";


const MIN_DIMENSION = 4000;

interface Props {
  updateImg(img: string): void;
  setOpenImgModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ImageCrop({ updateImg, setOpenImgModal }: Props) {
  // File Uploader States
  const [crop, setCrop] = React.useState<Crop | any>();
  const [file, setFile] = React.useState<string>("");
  const [fileName, setFileName] = React.useState("");
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
          setError("Please make sure the width and height of the image you selected is greater than 150px.");

          return setFile("");
        }
      });
      setFile(imageUrl);
      setFileName(file.name);
    });

    reader.readAsDataURL(file);
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



  return (
    <div className="w-full h-auto flex flex-col">
      {error && <h1 className="mt-1 mb-3 sm:text-[14px] text-[12px] text-red-600">{error}</h1>}

      {/* Input File Section & Button */}
      <div className="w-auto flex flex-col">
        {/* Custom Input File */}
        <div className="w-auto flex items-center">
          <button className="text-[15px] p-[2px] bg-gray-200 px-2  rounded-lg border border-lightText dark:border-none text-lightText" onClick={chooseImg}>
            Choose File
          </button>
          <p className="text-[15px] ml-2">{file ? fileName : "No file chosen"}</p>
        </div>
        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={getFiles} />
      </div>

      {/* Cropped Image Selector */}
      {file && (
        <div className="w-full h-auto flex justify-center">
          <ReactCrop
            crop={crop}
            keepSelection
            aspect={1}
            minWidth={MIN_DIMENSION}
            onChange={(pixelCrop, percentProp) => {
              setCrop(percentProp);
            }}
          >
            <img src={file} alt="" className=" !max-h-[400px] w-full" onLoad={onImgLoad} ref={refImg} />
          </ReactCrop>
        </div>
      )}

      {file && (
        <button
          className="my-4 p-2 dark:bg-darkText bg-lightText dark:border-none border border-lightText dark:text-lightText text-darkText rounded-lg"
          onClick={() => {
            if (refImg?.current && refPreview?.current) {
              setCanvasPreview(refImg.current, refPreview.current, convertToPixelCrop(crop, refImg.current.width, refImg.current.height));

               refPreview.current.toBlob((file)=>{
               if(file){
                const url = URL.createObjectURL(file)
                updateImg(url)
               }
              })
              setOpenImgModal(false);

              
            }
          }}
        >
          Crop Image
        </button>
      )}

      {crop && <canvas className="mt-6 w-[200px] h-[200px] object-cover border-2 border-black hidden" ref={refPreview} />}
    </div>
  );
}
