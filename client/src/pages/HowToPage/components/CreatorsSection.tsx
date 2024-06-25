import * as React from "react";
import { Dispatch, UseSelector } from "../../../redux/store";
import ContentCreatorCard from "./cards/ContentCreatorCard";
import { getAllContentCreators } from "../../../redux/features/contentCreatorSlice";
import { Pagination } from "@mui/material";


export interface ICreatorsSectionProps {}

export default function CreatorsSection(props: ICreatorsSectionProps) {
  // Redux States
  const dispatch = Dispatch();
  const { creatorData } = UseSelector((state) => state.contentCreator);
  const { creatorError, creatorLoading } = creatorData;
  const { lightAndDarkMode } = UseSelector((state) => state.app);

  // Page State
  const [pageState, setPageState] = React.useState(1);

  // Change Page of creators
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageState(value);
  };

  React.useEffect(() => {
    dispatch(getAllContentCreators({ page: pageState }));
  }, [pageState]); // eslint-disable-line



  if (creatorError) {
    return null;
  }
  return (
    <div className="w-full h-auto flex flex-col my-10">
      {/* Content */}
      <div className="w-full flex flex-col h-auto">
        <h1 className="text-[25px] underline ">Creators</h1>

        {/* Mapped Content Creators with Pagination */}
        <div className="w-full flex flex-col h-auto">
          {/* Mapped Data */}
          <div className="w-full h-auto grid grid-cols-1 gap-2">
            {creatorData.data.map((item) => (
              <ContentCreatorCard item={item} loading={creatorLoading} key={item.id}/>
            ))}
          </div>

          {/* Paginatio */}
          {!creatorLoading && creatorData.totalPages && creatorData.totalPages > 1 && (
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
          )}
        </div>
      </div>
    </div>
  );
}
