// This is my original filterData function that was working fine ... is anything happens to the other function I have this one right here

async function filterDataOriginal(req,res){
    try {
        const { lowMileage, highMileage, highPrice, lowPrice, makeAndModalStates, page, sortByState } = req.body;
        let data = allCarData;
    
      
    
        //* Filtering Data by price and mileage
        if (typeof lowMileage !== "number" || typeof lowPrice !== "number" || typeof highMileage !== "number" || typeof highPrice !== "number") {
          return res.status(400).json({ msg: "There was an error with price or mileage, our backend retreieved a string instead of a number" });
        }
        data = data.filter((item) => item.price >= lowPrice && item.price <= highPrice);
        data = data.filter((item) => item.mileage >= lowMileage && item.mileage <= highMileage);
    
        //We are also going to send our make and modal state
       let newArr = [];
    for (let items in makeAndModalStates) {
      if (makeAndModalStates[items] === true) {
        console.log(items)
        newArr.push(items === "LandRover" ? 'Land Rover': items);
      }
    }
    let filters = {
      name_modal: newArr,
    };

    function filterPlainArray(array, filters) {
      const filterKeys = Object.keys(filters);
      //console.log(filterKeys)
      // filterkey === name_modal
      return array.filter((item) => {
        // validates all filter criteria
        return filterKeys.every((key) => {
          // item[key] === 2021 Ford Expedition Limited
          // ignores an empty filter
          if (!filters[key].length) return true;
          return filters[key].find((filter) => item[key].includes(filter));
        });
      });
    }

     data = newArr.length ? filterPlainArray(data, filterSection) : data;
    
        // We are always going to send our sortby state ... either sort by lowest price to highest ... or vice versa
        if (sortByState === "Lowest Price") {
          data = data.sort((a, b) => {
            return a.price - b.price;
          });
        }
        if (sortByState === "Highest Price") {
          data = data.sort((a, b) => {
            return b.price - a.price;
          });
        }
        if (sortByState === "Lowest Mileage") {
          data = data.sort((a, b) => {
            return a.mileage - b.mileage;
          });
        }
        if (sortByState === "All") {
          data = data;
        }
    
        // Making sure theres no empty values before we send
        const checkData = data.filter((item) => isNaN(item.price) !== true);
    
        // Pagination on the backend
        const limit = 18;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = checkData.slice(startIndex, endIndex);
        const totalPages = Math.ceil(checkData.length / limit);
        const paginatedData = {
          cars: result,
          page: page,
          limit: limit,
          totalPages,
          totalCount: checkData.length,
        };
    
        res.send(paginatedData);
      } catch (e) {
        console.log(e);
        res.status(400).json({ msg: e.message });
      }
}