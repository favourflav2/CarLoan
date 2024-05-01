import * as React from 'react';

interface ArrayOfString {
    index:number;
    text:React.ReactNode;
}

export interface ITitleAndBodyProps {
    header:string
    arrayOfText: Array<ArrayOfString>
}

export default function TitleAndBody ({header, arrayOfText}: ITitleAndBodyProps) {
  return (
    <div className='w-full flex flex-col h-auto my-2'>
        {/* Content */}
        <div className='w-full flex flex-col h-full'>
            <h1 className='text-[19px] font-bold '>{header}</h1>

            {arrayOfText.map((item:ArrayOfString,index:number)=>(
                <p className='text-[15px] text-wrap leading-[30px] my-2' key={index}>{item.text}</p>
            ))}
        </div>
    </div>
  );
}
