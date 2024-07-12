import * as React from 'react';
import { UseSelector } from '../../redux/store';
import { Skeleton } from '@mui/material';

export interface IGoalLoadingCardProps {
}

export default function GoalLoadingCard (props: IGoalLoadingCardProps) {
    const {shrinkDashboardSidebar} = UseSelector(state => state.app)
  return (
    <div className="w-full h-full flex flex-col min-[900px]:px-0 px-4">
      {/* Top Section Chart and Inputs */}
      <div
        className={`w-full h-full grid ${
          shrinkDashboardSidebar
            ? "lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] min-[880px]:grid-cols-[250px_1fr] grid-cols-1"
            : "lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] grid-cols-1"
        }`}
      >
        {/* Left Side Inputs */}
        <div className={`w-full lg:h-[500px] h-[300px] flex `}>
           
          <Skeleton variant='rectangular' className='h-full w-full dark:bg-gray-700/30'/>
        </div>

        {/* Right Side Chart */}
         
            <div
              className="w-full flex flex-col dark:text-gray-300 text-black p-4"
            >
              <div className="w-auto flex flex-col">
                <Skeleton variant='rectangular' className='w-full h-[30px] mb-3 dark:bg-gray-700/30' />
                <Skeleton variant='rectangular' className='w-full h-[30px] mb-3 dark:bg-gray-700/30' />
                <Skeleton variant='rectangular' className='w-full h-[60px] mb-3 dark:bg-gray-700/30' />
              </div>

              {/* Chart Content */}
              <div className="w-full h-full flex flex-col my-5">
                
              <Skeleton variant='rectangular' className='w-full h-[30px] mb-3 dark:bg-gray-700/30' />

                {/* Charts Go Here */}
                <Skeleton variant='rectangular' className='w-full h-[500px] mb-3 dark:bg-gray-700/30' />
              </div>
            </div>
        
        
      </div>

     
    </div>
  );
}
