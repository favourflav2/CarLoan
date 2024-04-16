import { SelectedAddress } from "../houseComponents/House1stInputs";

export function getAddressValues(obj: SelectedAddress) {
    let address = "";
    let postalCode = ""

    for (const data of obj.address_components) {
      const type = data.types[0];
      

      switch (type) {
        case "street_number":
            console.log(data,"street number")
          address = data.long_name;
          break;
        case "route":
          address += " " + data.long_name;
          break;
        case "neighborhood":
          break;
        case "locality":
          address += ", " + data.long_name;
          break;
        case "administrative_area_level_1":
          address += " " + data.long_name;
          break;
        case "administrative_area_level_2":
          break;
        case "country":
          break;
        case "postal_code":
            address += ", " + data.long_name;
            postalCode = data.long_name
          break;
        
      }
    }

    return {
        address,
        postalCode
    }
  }
