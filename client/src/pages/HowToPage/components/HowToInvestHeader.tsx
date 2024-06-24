import * as React from 'react';
import how2InvestImg from '../../../assets/howToInvestImg.jpg'
import { LazyLoadImage } from 'react-lazy-load-image-component';

export interface IHowToInvestHeaderProps {
}

export default function HowToInvestHeader (props: IHowToInvestHeaderProps) {
  return (
    <div className='w-full h-[400px] grid md:grid-cols-2 grid-cols-1 md:gap-x-1'>
      <div className=' bg-slate-200/20 dark:bg-black p-4 flex flex-col'>

        {/* Content */}
        <div className='w-full flex flex-col h-auto items-center justify-center'>
            <h1 className='text-[35px] text-chartGreen'>Investing </h1>

            <p className='text-[13px] mt-8 italic leading-6'>I remember when I didn't know anything about money and investing. Now I'm learning and improving everyday by simply utilizing the many resources I have. Resources like books, Youtube, friends, and even through my own life experiences. Within this section we hope to provide a place where you can also learn and improve your understanding with your finances and have a better understanding on what it means to invest. </p>
        </div>
      </div>

      {/* Image */}
      <LazyLoadImage src={how2InvestImg} className='w-full h-full object-cover '/>
    </div>
  );
}
