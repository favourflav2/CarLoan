import * as React from "react";
import Resizer from "react-image-file-resizer";
import { Dispatch, UseSelector } from "../../redux/store";
import { editCarGoalImg } from "../../redux/features/modalSlices/carModalSlice";
import { editSelectedGoalImg } from "../../redux/features/applicationSlice";
import { editHouseGoalImg } from "../../redux/features/modalSlices/houseSlice";


interface Props {
  updateImg(img: string): void;
  setOpenImgModal: React.Dispatch<React.SetStateAction<boolean>>;
  type: "Edit" | "Create";
  
}
export default function ImageCrop({ updateImg, setOpenImgModal, type }: Props) {
  //Redux States
  const { selectedGoal } = UseSelector((state) => state.app);
  const { user } = UseSelector((state) => state.auth);
  const dispatch = Dispatch();

  const userId = user?.userObj.id;

  // File Uploader States
  const fileRef = React.useRef(null as null | HTMLInputElement);

  function chooseImg() {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }

  const resizeFile = (file: Blob) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        200,
        200,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64",
        200,
        200
      );
    });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
   if(!event?.target.files) return

    const file = event.target.files[0];
    const image = await resizeFile(file);
    
    switch (type) {
      case "Create":
        updateImg(image as string);
        setOpenImgModal(false);
        break;
      case "Edit":
        if (!selectedGoal) return;
        switch (selectedGoal.type) {
          case "Car":
            if (selectedGoal.type !== "Car") return;
            dispatch(editCarGoalImg({ id: selectedGoal.id, goal: selectedGoal, img: image as string }));
            dispatch(editSelectedGoalImg({ goal: selectedGoal, img: image as string }));
            setOpenImgModal(false);
            break;
          case "House":
            if (selectedGoal.type !== "House") return;
            dispatch(editHouseGoalImg({ id: selectedGoal.id, goal: selectedGoal, img: image as string }));
            dispatch(editSelectedGoalImg({ goal: selectedGoal, img: image as string }));
            setOpenImgModal(false);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full h-auto flex flex-col">
      {/* Input File Section & Button */}
      <div className="w-auto flex flex-col">
        {/* Custom Input File */}
        <div className="w-auto flex items-center">
          <button
            className="text-[15px] p-[2px] bg-gray-200 px-2  rounded-lg border border-lightText dark:border-none text-lightText"
            onClick={chooseImg}
          >
            Choose File
          </button>
        </div>
        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </div>
    </div>
  );
}
