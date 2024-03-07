import * as React from 'react';

export interface IRetirementInputsProps {
}

export default function RetirementInputs (props: IRetirementInputsProps) {
  return (
    <div className='w-full h-full p-4 flex flex-col bg-[#EADDCA] dark:bg-[#1814149c]'>
      {/* Content */}
      <div className='w-full flex flex-col'>
        <form className='w-full h-auto flex flex-col'>

            {/* Current Age */}
            <div className='w-auto flex flex-col'>
                <label htmlFor="Current Age" className='text-[12px] dark:text-gray-300 text-black'>Current Age</label>
                <input type="text" placeholder='Current Age' className='outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white'/>
            </div>

        </form>
      </div>
    </div>
  );
}
