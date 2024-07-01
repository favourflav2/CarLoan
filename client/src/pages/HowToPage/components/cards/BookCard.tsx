import * as React from 'react';
import { BooksArrayObj } from '../../../../redux/features/howToInvestSlice';
import { LazyLoadImage } from 'react-lazy-load-image-component';


export interface IBookCardProps {
    item: BooksArrayObj
}

export default function BookCard ({item}: IBookCardProps) {
  return (
    <div className='w-full flex flex-col h-auto px-2'>
      {/* Content */}
      <div className='w-full flex flex-col'>
        {/* Image */}
        <LazyLoadImage src={item.img} effect='blur' className='object-contain w-full max-h-[250px] '/>

        {/* Author */}
        <h1 className='w-full flex items-center justify-center my-1 text-[13px] text-gray-400 dark:text-gray-300 font-semibold'>{item.author}</h1>

        {/* Title */}
        <h1 className='w-full flex items-center justify-center  text-[15px] text-lightText dark:text-darkText '>{item.title.length >= 22 ? item.title.slice(0,21) + '...' : item.title}</h1>

        
      </div>
    </div>
  );
}
