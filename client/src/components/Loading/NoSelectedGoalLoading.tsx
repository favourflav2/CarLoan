import * as React from 'react';

export interface INoSelectedGoalLoadingProps {
}

export default function NoSelectedGoalLoading (props: INoSelectedGoalLoadingProps) {
  return (
    <div className="w-full h-full flex flex-col">
      
    {/* Content */}
    <div className="w-full h-auto flex flex-col p-5 2xl:px-[10%]">
        {/* First Box */}
        <div className="w-full grid lg:grid-cols-2 grid-cols-1 lg:gap-x-3 lg:gap-y-0 gap-y-4 text-lightText dark:text-darkText">

        <div>left</div>
        <div>Right</div>
        </div>

        <h1 className="w-full flex items-center justify-center font-bold text-[35px] mt-5 text-lightText dark:text-darkText underline ">Guide</h1>
        {/* Desktop View lg break point */}
        
    </div>
 
</div>
  );
}
