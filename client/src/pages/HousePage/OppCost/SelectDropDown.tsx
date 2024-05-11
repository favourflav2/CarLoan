import * as React from "react";
import { FormControl, NativeSelect } from "@mui/material";
import { UseSelector } from "../../../redux/store";

export interface ISelectDropDownProps {
  handleChange: (event: {
    target: {
      value: string;
    };
  }) => void;
  view: string;
}

export default function SelectDropDown({ handleChange, view }: ISelectDropDownProps) {
  // Redux States
  const { lightAndDarkMode } = UseSelector((state) => state.app);
  return (
    <div className="sm:hidden block">
      <FormControl variant="standard">
        <NativeSelect
          id="demo-customized-select-native"
          value={view}
          onChange={handleChange}
          sx={{
            boxShadow: "none",
            ".MuiNativeSelect-standard": {
              color: "#00A36C",
              fontWeight: "bold",
              background: "inherit",
            },
            "&::before": {
              borderColor: `${lightAndDarkMode ? "white" : "#00A36C"}`,
              backgroundColor: "none",
            },
            "&::after": {
              borderColor: "#00A36C",
              backgroundColor: "none",
            },

            "&:not(.Mui-disabled):hover::before": {
              borderColor: `${lightAndDarkMode ? "white" : ""}`,
            },
            ".MuiSvgIcon-root ": {
              fill: `${lightAndDarkMode ? "white" : ""}`,
            },
          }}
          className="mb-[2px]"
        >
          <option value={"Graph View"}>Graph View</option>
          <option value={"Break Even"}>Break Even</option>
          <option value={"Rent"}>Rent</option>
          <option value={"Diff."}>Diff.</option>
        </NativeSelect>
      </FormControl>
    </div>
  );
}
