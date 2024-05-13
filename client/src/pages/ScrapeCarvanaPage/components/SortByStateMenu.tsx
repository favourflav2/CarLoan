import * as React from "react";
import TuneIcon from "@mui/icons-material/Tune";
import { Divider, Menu, MenuItem } from "@mui/material";
import { FilterDataObj, setSortByState } from "../../../redux/features/carStateSlice";
import { Dispatch } from "../../../redux/store";
import { useSearchParams } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export interface ISortByStateMenuProps {
  filterStates: FilterDataObj;
}

export default function SortByStateMenu({ filterStates }: ISortByStateMenuProps) {
  const { sortByState } = filterStates;
  const dispatch = Dispatch();
  const [searchParams, setSearchParams] = useSearchParams(); // eslint-disable-line
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="w-full h-auto flex items-center justify-end">
      {/* Menu Button */}
      <div className="w-auto flex items-center cursor-pointer" onClick={handleClick}>
        <TuneIcon className="text-[20px] mr-1" />
        <h1 className="text-[14px] font-bold">Sort By {sortByState}</h1>
      </div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          className={`${sortByState === "All" && "bg-gray-300 underline"}`}
          onClick={() => {
            dispatch(setSortByState("All"));
            setSearchParams((searchParams) => {
              searchParams.set("sort", "All");
              return searchParams;
            });
            handleClose();
          }}
        >
          All
        </MenuItem>
        <MenuItem
          className={`${sortByState === "Highest Price" && "bg-gray-300 underline"}`}
          onClick={() => {
            dispatch(setSortByState("Highest Price"));
            setSearchParams((searchParams) => {
              searchParams.set("sort", "Highest Price");
              return searchParams;
            });
            handleClose();
          }}
        >
          Highest Price
        </MenuItem>
        <MenuItem
          className={`${sortByState === "Lowest Price" && "bg-gray-300 underline"}`}
          onClick={() => {
            dispatch(setSortByState("Lowest Price"));
            setSearchParams((searchParams) => {
              searchParams.set("sort", "Lowest Price");
              return searchParams;
            });
            handleClose();
          }}
        >
          Lowest Price
        </MenuItem>
        <MenuItem
          className={`${sortByState === "Lowest Mileage" && "bg-gray-300 underline"}`}
          onClick={() => {
            dispatch(setSortByState("Lowest Mileage"));
            setSearchParams((searchParams) => {
              searchParams.set("sort", "Lowest Mileage");
              return searchParams;
            });
            handleClose();
          }}
        >
          Lowest Mileage
        </MenuItem>
      </Menu>

      <Divider className=" border-gray-400 dark:bg-gray-800 mx-3" orientation="vertical" />

      {/* Saved */}
      <div className="w-auto flex items-center">
        <FavoriteBorderIcon className="text-[20px] mr-1" />
        <h1 className="text-[14px] font-bold">Saved Search</h1>
      </div>
    </div>
  );
}
