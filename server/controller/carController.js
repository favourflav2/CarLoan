import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { writeFile, readFile, promises } from "fs";
import NodeMailer from "nodemailer";
import schedule from "node-schedule";
import { allCarData } from "../data/Data.js";
import { env } from "custom-env";
import { getCarvanaNew } from "../functions/getCarvanaNew.js";
import { helpFormatCarName } from "../utils/helpFormatCarName.js";
env(true);

//* Node Scheduler and Node Mailer For Monthly Updates

puppeteer.use(StealthPlugin());

const transporter = NodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

const rule = new schedule.RecurrenceRule();

rule.month = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
rule.date = 1;
rule.hour = 0;
rule.minute = 0;

const job = schedule.scheduleJob(rule, async () => {
  //console.log("running a task every 5 second");
  const mail = await transporter.sendMail({
    to: process.env.EMAIL, // list of receivers
    subject: "Update Car Data", // Subject line
    text: "This is your backend notifying you that you need to update your web scrape data", // plain text body
    html: "", // html body
  });

  console.log("message sent", mail.messageId);
  console.log("Cron job is being ran");
});

//* Async Functions

// This function is responsible for scraping data
export async function getCarVana(req, res) {
  getCarvanaNew(req, res);
}

// Filter Functions for frontend

// Main function ... each refresh on frontend will call this function 
export async function filterData(req, res) {
  try {
    const { lowMileage, highMileage, highPrice, lowPrice, makeAndModalStates, page, sortByState } = req.body;
    let data = allCarData;

    //! check for long name modal

    //* If any of my prices or mileages are not numbers I return an error
    if (typeof lowMileage !== "number" || typeof lowPrice !== "number" || typeof highMileage !== "number" || typeof highPrice !== "number") {
      return res.status(400).json({ msg: "There was an error with price or mileage, our backend retreieved a string instead of a number" });
    }

    // Loop over makeAndModal object and send truthy car modal to an array

    //* Example) {
    // acura: true,
    // dodeg: false,
    //}
    // The result would be an array of the truthy value === ["acura"] ... then we will filter data for cars that have acura in them
    let newArr = [];
    for (let items in makeAndModalStates) {
      if (makeAndModalStates[items] === true) {
        newArr.push(helpFormatCarName(items));
      }
    }

    // This object contains all our filters we will have from the front end
    //* For now we will use this function as how main fetch all data function
    // Each fetch we will filter
    const filters = {
      price: (price) => price >= lowPrice && price <= highPrice,
      mileage: (mileage) => mileage >= lowMileage && mileage <= highMileage,
      name_modal: newArr,
    };

    // https://gist.github.com/jherax/f11d669ba286f21b7a2dcff69621eb72
    // got this function online ... this function filters an array of objects with multiple match-criteria
    //* I added some little tweeks

    function filterPlainArray(array, filters) {
      const filterKeys = Object.keys(filters);
      return array.filter((item) => {
        // validates all filter criteria
        return filterKeys.every((key) => {
          // ignores an empty filter

          //* If our filter critera is not a function ... then i check if its an array and then check if it has a length
          // This allows this function to run a filter on array of my truthy values makeAndModal values
          if (typeof filters[key] !== "function" && Array.isArray(filters[key]) && filters[key].length) {
            return filters[key].find((filter) => item[key].includes(filter));
          } else if (typeof filters[key] !== "function") {
            // If theres no filters/functions/array/or array length just return array of objects
            return true;
          } else {
            // if filter is equal to function and we run the function and return the filtered array of objects
            return filters[key](item[key]);
          }
        });
      });
    }

    data = filterPlainArray(data, filters);

    // We are always going to send our sortby state ... either sort by lowest price to highest ... or vice versa
    //* We sort at the very end when everything is filtered
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

export async function relatedCarData(req, res) {
  try {
    let data = allCarData.filter((item) => item.deal === "Great Deal");
    res.send(data.slice(0, 10));
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

// Search Data
export async function searchFunction(req, res) {
  try {
    let data = allCarData;
    const { searchValue } = req.body;

    function searchGeneretor(mockData, searchVal) {
      // firstD is checking is the first letter in data matches string from frontend
      let firstD = mockData?.filter((item) => item.name_modal.slice(5, item.name_modal.length).toLowerCase().startsWith(searchVal.toLowerCase()));
      let secondD = mockData?.filter((item) => item.name_modal.toLowerCase().includes(searchVal.toLowerCase()));

      if (firstD?.length) {
        return firstD;
      } else {
        return secondD;
      }
    }

    searchValue.length ? res.send(searchGeneretor(data, searchValue).slice(0, 6)) : res.send([]);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

// Item Details
export async function getOneCar(req, res) {
  try {
    const { id } = req.body;
    let data = allCarData.find((item) => item.index === Number(id));

    if (data) {
      res.send(data);
    } else {
      return res.status(404).json({ msg: "Sorry There is No Car with Provided Information" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

// Similar Cars
export async function similarCars(req, res) {
  try {
    const { id } = req.body;

    const findOne = allCarData.find((item) => item.index === Number(id));

    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;

      // While there remain elements to shuffle.
      while (currentIndex > 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }

      return array;
    }

    if (findOne) {
      let data = allCarData?.filter((item) => item.deal === findOne?.deal);
      let sortedData = shuffle(data);

      res.status(200).json(sortedData?.slice(0, 8));
    } else {
      res.status(404).json({ msg: "There was an error, we couldnt find similar cars" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}
