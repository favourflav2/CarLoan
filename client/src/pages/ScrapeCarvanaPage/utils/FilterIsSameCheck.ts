import _ from "lodash";
import { FilterDataObj } from "../../../redux/features/carStateSlice";
import { FormFields } from "../hooks/useFormHook";

export function FilterIsSameCheck(input: FormFields, reduxState: FilterDataObj) {
  const {
    lowPrice,
    highPrice,
    lowMileage,
    highMileage,
    sortByState,
    Acura,
    AlfaRomeo,
    Audi,
    BMW,
    Buick,
    Cadillac,
    Chevrolet,
    Chrysler,
    Dodge,
    FIAT,
    Ford,
    Genesis,
    GMC,
    Honda,
    Hyundai,
    INFINITI,
    Jaguar,
    Jeep,
    Kia,
    LandRover,
    Lexus,
    Lincoln,
    Lucid,
    Maserati,
    Mazada,
    MercedesBenz,
    MINI,
    Mitsubishi,
    Nissan,
    Polestar,
    Porsche,
    Ram,
    Rivian,
    Scion,
    Subaru,
    Telsa,
    Toyota,
    Volkswagen,
    Volvo,
  } = input;

  const newObj: FilterDataObj = {
    lowMileage: parseFloat(lowMileage.replace(/[,%$]/gm, "")),
    highMileage: parseFloat(highMileage.replace(/[,%$]/gm, "")),
    lowPrice: parseFloat(lowPrice.replace(/[,%$]/gm, "")),
    highPrice: parseFloat(highPrice.replace(/[,%$]/gm, "")),
    sortByState,
    makeAndModalStates: {
      Acura,
      AlfaRomeo,
      Audi,
      BMW,
      Buick,
      Cadillac,
      Chevrolet,
      Chrysler,
      Dodge,
      FIAT,
      Ford,
      Genesis,
      GMC,
      Honda,
      Hyundai,
      INFINITI,
      Jaguar,
      Jeep,
      Kia,
      LandRover,
      Lexus,
      Lincoln,
      Lucid,
      Maserati,
      Mazada,
      MercedesBenz,
      MINI,
      Mitsubishi,
      Nissan,
      Polestar,
      Porsche,
      Ram,
      Rivian,
      Scion,
      Subaru,
      Telsa,
      Toyota,
      Volkswagen,
      Volvo,
    },
  };

  return _.isEqual(reduxState, newObj) ? false : true;
}
