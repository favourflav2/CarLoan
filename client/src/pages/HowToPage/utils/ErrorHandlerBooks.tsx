import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";


export function BooksServerError(e:FetchBaseQueryError){
  return (
    <div className="w-full h-auto flex flex-col mb-10">
      <h1 className="sm:text-[25px] text-[20px] underline ">Books</h1>

      <h1 className="mt-2">
        An error as occured: <span className="font-bold">{JSON.stringify(e.data)} (Server)</span>
      </h1>
    </div>
  );
}

export function BooksApiError(e:SerializedError){
  return (
    <div className="w-full h-auto flex flex-col mb-10">
      <h1 className="sm:text-[25px] text-[20px] underline ">Books</h1>

      <h1 className="mt-2">
        An error as occured: <span className="font-bold">{e.message} (Api)</span>
      </h1>
    </div>
  );
}