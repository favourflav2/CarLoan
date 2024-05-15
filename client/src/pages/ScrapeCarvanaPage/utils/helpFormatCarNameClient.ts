export function helpFormatCarNameClient(item:string) {
    switch (item) {
      case "AlfaRomeo":
        return "Alfa Romeo";
      case "MercedesBenz":
        return "Mercedes-Benz";
      case "LandRover":
        return "Land Rover";
      default:
        return item;
    }
  }