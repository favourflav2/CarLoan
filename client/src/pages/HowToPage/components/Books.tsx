import * as React from 'react';
import { useGetAllBooksQuery } from '../../../redux/api/howToInvestApi';

export interface IBooksProps {
}

export default function Books (props: IBooksProps) {

     // Page State
  const [pageState, setPageState] = React.useState(1);

    // Redux States
    const {data, isFetching, isLoading, error} = useGetAllBooksQuery(pageState)

     

  return (
    <div className="w-full h-auto flex flex-col mb-10">
      {/* Content */}
      <div className="w-full flex flex-col h-auto">
        <h1 className="sm:text-[25px] text-[20px] underline ">Books</h1>

        {/* Mapped Content Creators with Pagination */}
        <div className="w-full flex flex-col h-auto">
          {/* Mapped Data */}
          <div className="w-full h-auto grid grid-cols-1 gap-2">
            {/* {creatorData.data.map((item) => (
              <ContentCreatorCard item={item} loading={creatorLoading} key={item.id}/>
            ))} */}
          </div>

          {/* Paginatio */}
          {/* {!creatorLoading && creatorData.totalPages && creatorData.totalPages > 1 && (
            <div className="w-full flex flex-col items-center justify-center mb-2 mt-4">
              <Pagination
                count={creatorData.totalPages || 0}
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
          )} */}
        </div>
      </div>
    </div>
  );
}
