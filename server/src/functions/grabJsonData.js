//! Function to grab all json data and format them ... next update ... going to format the data before I save it as json data
async function grabJSONData(req, res) {
    try {
      // TODO    JSON DATA
      const grabData = await promises.readFile("./data/carvanaMockData.json", "utf-8");
      const zero_To_100 = await promises.readFile("./data/carsDotComPage0-101.json", "utf-8");
      const _102_To_206 = await promises.readFile("./data/carsDotComPage102-206.json", "utf-8");
      const _207_To_301 = await promises.readFile("./data/carsDotComPage207-301.json", "utf-8");
      const _301_To_401 = await promises.readFile("./data/carsDotComPage301-401.json", "utf-8");
      const _402_To_601 = await promises.readFile("./data/carsDotComPage402-601.json", "utf-8");
  
      // TODO Function determing if car is a good deal
      function typeOfDeal(val) {
        if (val.price > 0 && val.price <= 5000) {
          return "Cheap Car";
        }
        if (val.price > 5000 && val.price < 10000 && val.mileage <= 80000) {
          return "Great Deal";
        }
        if (val.price > 11000 && val.price < 24000 && val.mileage > 85000) {
          return "Great Car Price But Higher Mileage";
        }
        if (val.price >= 24000 && val.price <= 32000) {
          return "Average Priced Car";
        }
        if (val.price > 32000 && val.price <= 40000) {
          return "Just Above National Average";
        }
        if (val.price > 40000) {
          return "Higher Priced Cars";
        }
      }
  
      // TODO Converted Dated
      const carVana = JSON.parse(grabData).map((item) => {
        return {
          ...item,
          mileage: Number(
            item.mileage
              .toLowerCase()
              .replace(/[,]/gm, "")
              .replace(/([a-z])/gm, "")
          ),
          price: Number(item.price.replace(/[$,]/g, "")),
        };
      });
      let carDotCom = JSON.parse(zero_To_100)
        .concat(JSON.parse(_102_To_206), JSON.parse(_102_To_206), JSON.parse(_207_To_301), JSON.parse(_301_To_401), JSON.parse(_402_To_601))
        .map((item) => {
          return {
            ...item,
            mileage: Number(
              item.mileage
                .toLowerCase()
                .replace(/[,]/gm, "")
                .replace(/([a-z])/gm, "")
            ),
            price: Number(item.price.replace(/[$,]/g, "")),
            type: "Cars.com",
          };
        });
  
      let finalDataCarVana = carVana.map((item) => {
        return {
          ...item,
          type: "Carvana Certified",
          deal: typeOfDeal(item),
        };
      });
      let finalDataCarDotCom = carDotCom.map((item) => {
        return {
          ...item,
          deal: typeOfDeal(item),
        };
      });
  
      let allCarData = finalDataCarVana.concat(finalDataCarDotCom)?.map((item, index) => {
        return {
          ...item,
          index,
        };
      });
    } catch (e) {
      console.log(e);
    }
  }