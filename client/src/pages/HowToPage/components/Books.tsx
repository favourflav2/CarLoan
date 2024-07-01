import * as React from "react";
import { useGetAllBooksQuery } from "../../../redux/api/howToInvestApi";
import { BooksApiError, BooksServerError } from "../utils/ErrorHandlerBooks";
import BooksSlider from "./BooksSlider";
import { Pagination } from "@mui/material";
import { UseSelector } from "../../../redux/store";

export interface IBooksProps {}

export default function Books(props: IBooksProps) {
  // Page State
  const [pageState, setPageState] = React.useState(1);

  // Redux States
  const { data, isFetching, isLoading, error, refetch } = useGetAllBooksQuery(pageState);
  const {lightAndDarkMode} = UseSelector(state => state.app)


  // Change Page of creators
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageState(value);
  };
  



  if (error) {
    if ("status" in error) {
      return BooksServerError(error);
    } else {
      return BooksApiError(error);
    }
  }

  return (
    <div className="w-full h-auto flex flex-col mb-10">
      {/* Content */}
      <div className="w-full flex flex-col h-auto">
        <h1 className="sm:text-[25px] text-[20px] underline mb-5">Books</h1>

        {/* <button className="w-full h-[30px] bg-red-500" onClick={() => refetch()}>
          Refetch
        </button> */}

        {/* Mapped Data Container  */}
        <div className="w-full flex flex-col h-auto ">

          {/* Slider Container */}
          {data && <BooksSlider data={data.data} loading={isLoading} fetch={isFetching} />}

          {/* Paginatio */}
           {data && !isLoading && !isFetching && data.totalPages > 1 && (
            <div className="w-full flex flex-col items-center justify-center mt-[50px]">
              <Pagination
                count={data.totalPages}
                onChange={handlePageChange}
                page={pageState}
                size="small"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderColor: `${lightAndDarkMode ? "#d1d5db" : "#d1d5db"}`,
                    color: `${lightAndDarkMode ? "#d1d5db" : "black"}`,
                    "&.Mui-selected": {
                      background: `${lightAndDarkMode ? "#d1d5db" : "#d1d5db"}`,
                      color: `${lightAndDarkMode ? "black" : "black"}`,
                    },
                  },
                }}
              />
            </div>
          )} 
        </div>
      </div>
    </div>
  );
}





