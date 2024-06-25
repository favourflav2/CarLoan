import * as React from "react";
import { CreatorDataObj } from "../../../../redux/features/howToInvestSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Skeleton } from "@mui/material";
import YoutubeCard from "./YoutubeCard";



export interface IContentCreatorCardProps {
  item: CreatorDataObj;
  loading: boolean;
}

export default function ContentCreatorCard({ item, loading }: IContentCreatorCardProps) {



 
  return (
    <div className="w-full h-auto flex flex-col mb-[70px]">
      {/* Content */}
      {loading ? (
        <div className="w-full h-auto flex flex-col">
          <div className="w-full h-auto grid grid-cols-[30%_1fr] my-5 gap-x-10">
            {/* Left Side Image */}
            <Skeleton variant="rectangular" className="h-[200px] dark:bg-white/20" />

            {/* Right Side */}
            <Skeleton variant="rectangular" className="h-[200px] dark:bg-white/20" />
          </div>
        </div>
      ) : (
        <div className="w-full h-auto flex flex-col">
          {/* Header Card */}
          <div className="w-full h-auto grid min-[545px]:grid-cols-[30%_1fr] min-[545px]:gap-x-10 min-[545px]:gap-y-0  grid-cols-1 gap-x-10 gap-y-3 my-5 ">
            {/* Left Side Image */}
            <LazyLoadImage src={item.photo} effect="blur" alt="creator" className=" w-full min-h-[200px] object-cover  rounded-xl mb-4" />

            {/* Right Side */}

            {/* About */}
            <div className="w-full flex flex-col h-auto justify-center">
              <p className="text-[13px] leading-6">
                <span className=" underline font-semibold">About:</span> {item.about}
              </p>

              {/* Icons */}

              <div className="w-full h-auto flex justify-center items-center min-[545px]:mt-3 mt-4">
                <a href={item.twitter} target="_blank" rel="noreferrer">
                  <button>
                    <TwitterIcon />
                  </button>
                </a>
                <a href={item.youtube} target="_blank" rel="noreferrer">
                  <button className="mx-4">
                    <YouTubeIcon />
                  </button>
                </a>
                <a href={item.instagram} target="_blank" rel="noreferrer">
                  <button>
                    <InstagramIcon />
                  </button>
                </a>
              </div>
            </div>
          </div>

          <YoutubeCard id={item.id}/>

        </div>
      )}
    </div>
  );
}
