import * as React from "react";
import ReactPlayer from "react-player/lazy";
import { LazyLoadComponent } from "react-lazy-load-image-component";

export interface IYoutubeReactPlayerProps {
  link: string;
}

export default function YoutubeReactPlayer({ link }: IYoutubeReactPlayerProps) {
  return (
    <div className=" relative pt-[56.25%]">
      <LazyLoadComponent >
        <ReactPlayer url={link} playing={false} height="100%" width="100%" className=" absolute top-0 left-0 " />
      </LazyLoadComponent>
    </div>
  );
}
