import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { writeFile, readFile, promises } from "fs";
import NodeMailer from "nodemailer";
import schedule from "node-schedule";
import { allCarData } from "../data/Data.js";
import { env } from "custom-env";
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





//! Function to grab all json data and format them ... next update ... going to format the data before I save it as json data
async function grabJSONData(req,res){
  try{
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
})

  }catch(e){
    console.log(e)
  }
}
function removeDups(arr) {
  const unique = arr.filter((obj, index) => {
    
    return index === arr.findIndex(o => obj.name_modal === o.name_modal && obj.type === o.type && obj.price === o.price);
});
return unique
}



//* Async Functions

export async function getCarVana(req, res) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto("https://www.carvana.com/cars");
    await page.waitForSelector(".result-tile");
    await page.waitForSelector(".carvana-certified");
    const totalPages = await page.$eval('[data-qa="total-pages"]', (item) => item.textContent);

    let currentPageNum = 1;
    let result = [];
    //! Correct One that works
    // while (currentPageNum < totalPages) {
    //   if (currentPageNum === totalPages) break;

    //   // Scroll To The Bottom of the page to help with lazy loaded images

    //   await page.evaluate(async () => {
    //     let scrollPosition = 0;
    //     let documentHeight = document.body.scrollHeight;

    //     while (documentHeight > scrollPosition) {
    //       window.scrollBy(0, documentHeight);
    //       await new Promise((resolve) => {
    //         setTimeout(resolve, 1000);
    //       });
    //       scrollPosition = documentHeight;
    //       documentHeight = document.body.scrollHeight;
    //       await new Promise((resolve) => {
    //         setTimeout(resolve, 1000);
    //       });
    //     }

    //   });

    //   try{
    //     const carVanaData = await page.$$eval(".result-tile", (carCard) => {
    //         return carCard.map((item) => {
    //           const img2 = item.querySelector("picture img ") ? item.querySelector("picture img ") : "";
    //           const type2 = item.querySelector(".inventory-type");
    //           const name_model2 = item.querySelector(".year-make");
    //           const mileage_name2 = item.querySelector(" div.trim-mileage > span:nth-child(1)");
    //           const mileage2 = item.querySelector(" div.trim-mileage > span:nth-child(2)");
    //           const price2 = item.querySelector('[data-qa="price"]');

    //           return {
    //             img: img2.src ? img2.src : "",
    //             type: type2.textContent,
    //             name_modal: name_model2.innerText,
    //             mileage: mileage2.textContent,
    //             mileage_name: mileage_name2.textContent,
    //             price: price2.textContent,
    //           };
    //         });
    //       });

    //       for (const item of carVanaData) {
    //         result.push(item);
    //       }
    //       const pagginationBtns = await page.waitForSelector(`[data-qa="pagination-wrapper"]`)
    //       const nextPageBtn = await page.$(`[data-qa="page-${currentPageNum + 1}"]`);
    //       const nextArrowBtn = await page.waitForSelector(`[data-qa="next-page"]`);
    //       if(nextPageBtn){
    //         await nextPageBtn.click()
    //         console.log('Clicked Btn Number')
    //       }else{
    //         await nextArrowBtn.click()
    //         console.log('Clicked Next Btn Arrow')
    //       }
    //       await new Promise((r) => setTimeout(r, 1000));
    //       const certifiedCheck = await page.$(".carvana-certified")
    //       //await page.waitForSelector(".carvana-certified");
    //       if(certifiedCheck){
    //         currentPageNum++;
    //         console.log(currentPageNum)
    //       }else{
    //         break
    //       }

    //   }catch(e){
    //     console.log(e)
    //     console.log(`There was an error with the while loop however data will still be saved... error happend on page ${currentPageNum}`)
    //     break
    //   }

    // }

    //* New and improved while loop
    // Whithin my while loops we are doing 200 each... if there is an error we will save the data ... and know where the error occured
    while (currentPageNum < 201) {
      if (currentPageNum === totalPages) break;

      // Scroll To The Bottom of the page to help with lazy loaded images

      await page.evaluate(async () => {
        let scrollPosition = 0;
        let documentHeight = document.body.scrollHeight;

        while (documentHeight > scrollPosition) {
          window.scrollBy(0, documentHeight);
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
          scrollPosition = documentHeight;
          documentHeight = document.body.scrollHeight;
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        }
      });

      try {
        const carVanaData = await page.$$eval(".result-tile", (carCard) => {
          return carCard.map((item) => {
            const img2 = item.querySelector("picture img ") ? item.querySelector("picture img ") : "";
            const type2 = item.querySelector(".inventory-type");
            const name_model2 = item.querySelector(".year-make");
            const mileage_name2 = item.querySelector(" div.trim-mileage > span:nth-child(1)");
            const mileage2 = item.querySelector(" div.trim-mileage > span:nth-child(2)");
            const price2 = item.querySelector('[data-qa="price"]');

            return {
              img: img2.src ? img2.src : "",
              type: type2.textContent,
              name_modal: name_model2.innerText,
              mileage: mileage2.textContent,
              mileage_name: mileage_name2.textContent,
              price: price2.textContent,
            };
          });
        });

        for (const item of carVanaData) {
          result.push(item);
        }
        const pagginationBtns = await page.waitForSelector(`[data-qa="pagination-wrapper"]`);
        const nextPageBtn = await page.$(`[data-qa="page-${currentPageNum + 1}"]`);
        const nextArrowBtn = await page.waitForSelector(`[data-qa="next-page"]`);
        if (nextPageBtn) {
          await nextPageBtn.click();
          console.log("Clicked Btn Number");
        } else {
          await nextArrowBtn.click();
          console.log("Clicked Next Btn Arrow");
        }
        await new Promise((r) => setTimeout(r, 2000));
        const certifiedCheck = await page.$(".carvana-certified");
        //await page.waitForSelector(".carvana-certified");
        if (certifiedCheck) {
          currentPageNum++;
          console.log(currentPageNum);
        } else {
          writeFile(`./data/carVanaDataErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
            if (err) {
              throw err;
            } else {
              console.log("saved file");
            }
          });
          console.log(`Got out of while loop on page ${currentPageNum} on certfied check ... but we still saved the data`);
          break;
        }
      } catch (e) {
        writeFile(`./data/carVanaDataErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
          if (err) {
            throw err;
          } else {
            console.log("saved file");
          }
        });
        console.log(e);
        console.log(`There was an error with the while loop however data will still be saved... error happend on page ${currentPageNum}`);
        break;
      }
    }

    while (currentPageNum < 401) {
      if (currentPageNum === totalPages) break;

      // Scroll To The Bottom of the page to help with lazy loaded images

      await page.evaluate(async () => {
        let scrollPosition = 0;
        let documentHeight = document.body.scrollHeight;

        while (documentHeight > scrollPosition) {
          window.scrollBy(0, documentHeight);
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
          scrollPosition = documentHeight;
          documentHeight = document.body.scrollHeight;
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        }
      });

      try {
        const carVanaData = await page.$$eval(".result-tile", (carCard) => {
          return carCard.map((item) => {
            const img2 = item.querySelector("picture img ") ? item.querySelector("picture img ") : "";
            const type2 = item.querySelector(".inventory-type");
            const name_model2 = item.querySelector(".year-make");
            const mileage_name2 = item.querySelector(" div.trim-mileage > span:nth-child(1)");
            const mileage2 = item.querySelector(" div.trim-mileage > span:nth-child(2)");
            const price2 = item.querySelector('[data-qa="price"]');

            return {
              img: img2.src ? img2.src : "",
              type: type2.textContent,
              name_modal: name_model2.innerText,
              mileage: mileage2.textContent,
              mileage_name: mileage_name2.textContent,
              price: price2.textContent,
            };
          });
        });

        for (const item of carVanaData) {
          result.push(item);
        }
        const pagginationBtns = await page.waitForSelector(`[data-qa="pagination-wrapper"]`);
        const nextPageBtn = await page.$(`[data-qa="page-${currentPageNum + 1}"]`);
        const nextArrowBtn = await page.waitForSelector(`[data-qa="next-page"]`);
        if (nextPageBtn) {
          await nextPageBtn.click();
          console.log("Clicked Btn Number");
        } else {
          await nextArrowBtn.click();
          console.log("Clicked Next Btn Arrow");
        }
        await new Promise((r) => setTimeout(r, 2000));
        const certifiedCheck = await page.$(".carvana-certified");
        //await page.waitForSelector(".carvana-certified");
        if (certifiedCheck) {
          currentPageNum++;
          console.log(currentPageNum);
        } else {
          writeFile(`./data/carVanaDataErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
            if (err) {
              throw err;
            } else {
              console.log("saved file");
            }
          });
          console.log(`Got out of while loop on page ${currentPageNum} on certfied check ... but we still saved the data`);
          break;
        }
      } catch (e) {
        writeFile(`./data/carVanaDataErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
          if (err) {
            throw err;
          } else {
            console.log("saved file");
          }
        });
        console.log(e);
        console.log(`There was an error with the while loop however data will still be saved... error happend on page ${currentPageNum}`);
        break;
      }
    }

    while (currentPageNum < 601) {
      if (currentPageNum === totalPages) break;

      // Scroll To The Bottom of the page to help with lazy loaded images

      await page.evaluate(async () => {
        let scrollPosition = 0;
        let documentHeight = document.body.scrollHeight;

        while (documentHeight > scrollPosition) {
          window.scrollBy(0, documentHeight);
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
          scrollPosition = documentHeight;
          documentHeight = document.body.scrollHeight;
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        }
      });

      try {
        const carVanaData = await page.$$eval(".result-tile", (carCard) => {
          return carCard.map((item) => {
            const img2 = item.querySelector("picture img ") ? item.querySelector("picture img ") : "";
            const type2 = item.querySelector(".inventory-type");
            const name_model2 = item.querySelector(".year-make");
            const mileage_name2 = item.querySelector(" div.trim-mileage > span:nth-child(1)");
            const mileage2 = item.querySelector(" div.trim-mileage > span:nth-child(2)");
            const price2 = item.querySelector('[data-qa="price"]');

            return {
              img: img2.src ? img2.src : "",
              type: type2.textContent,
              name_modal: name_model2.innerText,
              mileage: mileage2.textContent,
              mileage_name: mileage_name2.textContent,
              price: price2.textContent,
            };
          });
        });

        for (const item of carVanaData) {
          result.push(item);
        }
        const pagginationBtns = await page.waitForSelector(`[data-qa="pagination-wrapper"]`);
        const nextPageBtn = await page.$(`[data-qa="page-${currentPageNum + 1}"]`);
        const nextArrowBtn = await page.waitForSelector(`[data-qa="next-page"]`);
        if (nextPageBtn) {
          await nextPageBtn.click();
          console.log("Clicked Btn Number");
        } else {
          await nextArrowBtn.click();
          console.log("Clicked Next Btn Arrow");
        }
        await new Promise((r) => setTimeout(r, 2000));
        const certifiedCheck = await page.$(".carvana-certified");
        //await page.waitForSelector(".carvana-certified");
        if (certifiedCheck) {
          currentPageNum++;
          console.log(currentPageNum);
        } else {
          writeFile(`./data/carVanaDataErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
            if (err) {
              throw err;
            } else {
              console.log("saved file");
            }
          });
          console.log(`Got out of while loop on page ${currentPageNum} on certfied check ... but we still saved the data`);
          break;
        }
      } catch (e) {
        writeFile(`./data/carVanaDataErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
          if (err) {
            throw err;
          } else {
            console.log("saved file");
          }
        });
        console.log(e);
        console.log(`There was an error with the while loop however data will still be saved... error happend on page ${currentPageNum}`);
        break;
      }
    }

    while (currentPageNum < 801) {
      if (currentPageNum === totalPages) break;

      // Scroll To The Bottom of the page to help with lazy loaded images

      await page.evaluate(async () => {
        let scrollPosition = 0;
        let documentHeight = document.body.scrollHeight;

        while (documentHeight > scrollPosition) {
          window.scrollBy(0, documentHeight);
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
          scrollPosition = documentHeight;
          documentHeight = document.body.scrollHeight;
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        }
      });

      try {
        const carVanaData = await page.$$eval(".result-tile", (carCard) => {
          return carCard.map((item) => {
            const img2 = item.querySelector("picture img ") ? item.querySelector("picture img ") : "";
            const type2 = item.querySelector(".inventory-type");
            const name_model2 = item.querySelector(".year-make");
            const mileage_name2 = item.querySelector(" div.trim-mileage > span:nth-child(1)");
            const mileage2 = item.querySelector(" div.trim-mileage > span:nth-child(2)");
            const price2 = item.querySelector('[data-qa="price"]');

            return {
              img: img2.src ? img2.src : "",
              type: type2.textContent,
              name_modal: name_model2.innerText,
              mileage: mileage2.textContent,
              mileage_name: mileage_name2.textContent,
              price: price2.textContent,
            };
          });
        });

        for (const item of carVanaData) {
          result.push(item);
        }
        const pagginationBtns = await page.waitForSelector(`[data-qa="pagination-wrapper"]`);
        const nextPageBtn = await page.$(`[data-qa="page-${currentPageNum + 1}"]`);
        const nextArrowBtn = await page.waitForSelector(`[data-qa="next-page"]`);
        if (nextPageBtn) {
          await nextPageBtn.click();
          console.log("Clicked Btn Number");
        } else {
          await nextArrowBtn.click();
          console.log("Clicked Next Btn Arrow");
        }
        await new Promise((r) => setTimeout(r, 2000));
        const certifiedCheck = await page.$(".carvana-certified");
        //await page.waitForSelector(".carvana-certified");
        if (certifiedCheck) {
          currentPageNum++;
          console.log(currentPageNum);
        } else {
          writeFile(`./data/carVanaDataErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
            if (err) {
              throw err;
            } else {
              console.log("saved file");
            }
          });
          console.log(`Got out of while loop on page ${currentPageNum} on certfied check ... but we still saved the data`);
          break;
        }
      } catch (e) {
        writeFile(`./data/carVanaDataErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
          if (err) {
            throw err;
          } else {
            console.log("saved file");
          }
        });
        console.log(e);
        console.log(`There was an error with the while loop however data will still be saved... error happend on page ${currentPageNum}`);
        break;
      }
    }

    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: "./screenshots/1111.jpg" });

    writeFile("./data/updatedCarvanaMockData.json", JSON.stringify(result), "utf-8", (err) => {
      if (err) {
        throw err;
      } else {
        console.log("saved file");
      }
    });

    await browser.close();
    res.send("hello");
  } catch (e) {
    console.log(e);
    console.log(e.message);
  }
}

export async function carVanaData(req, res) {
  try {
    let checkData = finalDataCarVana.concat(finalDataCarDotCom).filter((item) => isNaN(item.price) !== true);

    // Pagination on the backend
    const page = parseInt(req.query.page) || 1;
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

export async function getCars_com(req, res) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto("https://www.cars.com/shopping/results/?maximum_distance=all&mileage_max=&page=402&stock_type=used&year_max=&year_min=&zip=89129");
    await page.waitForSelector(".sds-page-section__content");
    // https://www.cars.com/shopping/results/?makes=&page=110&stock_type=used&zip=89129
    //ttps://www.cars.com/shopping/results/?stock_type=used&makes
    // https://www.cars.com/shopping/results/?maximum_distance=all&mileage_max=&stock_type=used&year_max=&year_min=&zip=89129

    let currentPageNum = 402;
    let result = [];

    while (currentPageNum < 601) {
      if (currentPageNum === 802) break;

      // Scrolling down to the bottom of page
      await page.evaluate(async () => {
        let scrollPosition = 0;
        let documentHeight = document.body.scrollHeight;

        while (documentHeight > scrollPosition) {
          window.scrollBy(0, documentHeight);
          await new Promise((resolve) => {
            setTimeout(resolve, 1500);
          });
          scrollPosition = documentHeight;
          documentHeight = document.body.scrollHeight;
          await new Promise((resolve) => {
            setTimeout(resolve, 1500);
          });
        }
      });

      // Try and Catch we going to grab all cards
      try {
        const carDotComData = await page.$$eval(".vehicle-card", (carCard) => {
          return carCard.map((item) => {
            let img = item.querySelector("div > div.vehicle-card-photos.js-gallery-click-gallery > cars-filmstrip > div > div:nth-child(1) > img");
            let title = item.querySelector("div > div.vehicle-details > a > h2")?.textContent || "";
            let mileage =
              item
                .querySelector('[data_qa="mileage"]')
                ?.textContent?.replace(/([a-z])/gm, "")
                .replace(/[.]/gm, "")
                .replace(/^\s+|\s+$|\s+(?=\s)/g, "") || "";
            let price = item.querySelector(".primary-price")?.textContent || "";

            return {
              img: img?.src ? (img?.src === "https://www.cars.com/images/placeholder_10x10.png" ? img.getAttribute("data-src") : img?.src) : "",
              name_modal: title ? title : "",
              mileage: mileage ? `${mileage} miles` : "",
              price: price ? price : "",
            };
          });
        });

        // Loop of scraped data and push into array
        for (const item of carDotComData) {
          result.push(item);
        }

        // Pagination Section
        await new Promise((resolve) => {
          setTimeout(resolve, 1500);
        });
        const pagginationBtns = await page.waitForSelector(`.sds-pagination__list`, { visible: true });
        const nextPageBtn = await page.$(`[aria-label="Go to Page ${currentPageNum + 1}"]`);
        const nextArrowBtn = await page.waitForSelector(`#next_paginate`);

        if (nextPageBtn) {
          await nextPageBtn.click();
          console.log("Clicked Btn Number");
        } else {
          await nextArrowBtn.click();
          console.log("Clicked Next Btn Arrow");
        }

        await new Promise((r) => setTimeout(r, 2000));

        const contentBody = await page.waitForSelector(".vehicle-card");

        // If the next page content body is loaded we contine otherwise we throw and error and break from while loop
        if (contentBody) {
          currentPageNum++;
          console.log(currentPageNum);
        } else {
          writeFile(`./data/carDotComErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
            if (err) {
              throw err;
            } else {
              console.log("saved file");
            }
          });
          console.log(`Got out of while loop on page ${currentPageNum} on content body check ... but we still saved the data`);
          break;
        }
      } catch (e) {
        writeFile(`./data/carDotComErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
          if (err) {
            throw err;
          } else {
            console.log("saved file");
          }
        });
        console.log(e);
        console.log(`There was an error with the while loop however data will still be saved... error happend on page ${currentPageNum}.. cars.com`);
        break;
      }
    }

    // while(currentPageNum < 401){
    //   if (currentPageNum === 802) break;

    //   // Scrolling down to the bottom of page
    //   await page.evaluate(async () => {
    //     let scrollPosition = 0;
    //     let documentHeight = document.body.scrollHeight;

    //     while (documentHeight > scrollPosition) {
    //       window.scrollBy(0, documentHeight);
    //       await new Promise((resolve) => {
    //         setTimeout(resolve, 1000);
    //       });
    //       scrollPosition = documentHeight;
    //       documentHeight = document.body.scrollHeight;
    //       await new Promise((resolve) => {
    //         setTimeout(resolve, 1000);
    //       });
    //     }
    //   });

    //   // Try and Catch we going to grab all cards
    //   try{
    //     const carDotComData = await page.$$eval(".vehicle-card", (carCard)=>{
    //       return carCard.map((item)=>{
    //         let img = item.querySelector('div > div.vehicle-card-photos.js-gallery-click-gallery > cars-filmstrip > div > div:nth-child(1) > img')
    //         let title = item.querySelector('div > div.vehicle-details > a > h2')
    //         let mileage = item.querySelector('[data_qa="mileage"]')
    //         let price = item.querySelector('.primary-price')

    //         return {
    //           img: img?.src ?
    //           img?.src === "https://www.cars.com/images/placeholder_10x10.png" ? img.getAttribute('data-src') : img?.src : "",
    //           name_modal: title.textContent,
    //           mileage: `${mileage.textContent.replace(/([a-z])/gm, "").replace(/[.]/gm, "").replace(/^\s+|\s+$|\s+(?=\s)/g, "")} miles`,
    //           price: price.textContent
    //         }
    //       })
    //     })

    //     // Loop of scraped data and push into array
    //     for(const item of carDotComData){
    //       result.push(item)
    //     }

    //     // Pagination Section
    //     const pagginationBtns = await page.waitForSelector(`.sds-pagination__list`);
    //     const nextPageBtn = await page.$(`[aria-label="Go to Page ${currentPageNum + 1}"]`);
    //     const nextArrowBtn = await page.waitForSelector(`#next_paginate`);

    //     if (nextPageBtn) {
    //       await nextPageBtn.click();
    //       console.log("Clicked Btn Number");
    //     } else {
    //       await nextArrowBtn.click();
    //       console.log("Clicked Next Btn Arrow");
    //     }

    //     await new Promise((r) => setTimeout(r, 2000));

    //     const contentBody = await page.waitForSelector('.vehicle-card')

    //     // If the next page content body is loaded we contine otherwise we throw and error and break from while loop
    //     if (contentBody) {
    //       currentPageNum++;
    //       console.log(currentPageNum);
    //     } else {
    //       writeFile(`./data/carDotComErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
    //         if (err) {
    //           throw err;
    //         } else {
    //           console.log("saved file");
    //         }
    //       });
    //       console.log(`Got out of while loop on page ${currentPageNum} on content body check ... but we still saved the data`);
    //       break;
    //     }

    //   }catch(e){
    //     writeFile(`./data/carDotComErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
    //       if (err) {
    //         throw err;
    //       } else {
    //         console.log("saved file");
    //       }
    //     });
    //     console.log(e);
    //     console.log(`There was an error with the while loop however data will still be saved... error happend on page ${currentPageNum}.. cars.com`);
    //     break;
    //   }
    // }

    // while(currentPageNum < 601){
    //   if (currentPageNum === 802) break;

    //   // Scrolling down to the bottom of page
    //   await page.evaluate(async () => {
    //     let scrollPosition = 0;
    //     let documentHeight = document.body.scrollHeight;

    //     while (documentHeight > scrollPosition) {
    //       window.scrollBy(0, documentHeight);
    //       await new Promise((resolve) => {
    //         setTimeout(resolve, 1000);
    //       });
    //       scrollPosition = documentHeight;
    //       documentHeight = document.body.scrollHeight;
    //       await new Promise((resolve) => {
    //         setTimeout(resolve, 1000);
    //       });
    //     }
    //   });

    //   // Try and Catch we going to grab all cards
    //   try{
    //     const carDotComData = await page.$$eval(".vehicle-card", (carCard)=>{
    //       return carCard.map((item)=>{
    //         let img = item.querySelector('div > div.vehicle-card-photos.js-gallery-click-gallery > cars-filmstrip > div > div:nth-child(1) > img')
    //         let title = item.querySelector('div > div.vehicle-details > a > h2')
    //         let mileage = item.querySelector('[data_qa="mileage"]')
    //         let price = item.querySelector('.primary-price')

    //         return {
    //           img: img?.src ?
    //           img?.src === "https://www.cars.com/images/placeholder_10x10.png" ? img.getAttribute('data-src') : img?.src : "",
    //           name_modal: title.textContent,
    //           mileage: `${mileage.textContent.replace(/([a-z])/gm, "").replace(/[.]/gm, "").replace(/^\s+|\s+$|\s+(?=\s)/g, "")} miles`,
    //           price: price.textContent
    //         }
    //       })
    //     })

    //     // Loop of scraped data and push into array
    //     for(const item of carDotComData){
    //       result.push(item)
    //     }

    //     // Pagination Section
    //     const pagginationBtns = await page.waitForSelector(`.sds-pagination__list`);
    //     const nextPageBtn = await page.$(`[aria-label="Go to Page ${currentPageNum + 1}"]`);
    //     const nextArrowBtn = await page.waitForSelector(`#next_paginate`);

    //     if (nextPageBtn) {
    //       await nextPageBtn.click();
    //       console.log("Clicked Btn Number");
    //     } else {
    //       await nextArrowBtn.click();
    //       console.log("Clicked Next Btn Arrow");
    //     }

    //     await new Promise((r) => setTimeout(r, 2000));

    //     const contentBody = await page.waitForSelector('.vehicle-card')

    //     // If the next page content body is loaded we contine otherwise we throw and error and break from while loop
    //     if (contentBody) {
    //       currentPageNum++;
    //       console.log(currentPageNum);
    //     } else {
    //       writeFile(`./data/carDotComErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
    //         if (err) {
    //           throw err;
    //         } else {
    //           console.log("saved file");
    //         }
    //       });
    //       console.log(`Got out of while loop on page ${currentPageNum} on content body check ... but we still saved the data`);
    //       break;
    //     }

    //   }catch(e){
    //     writeFile(`./data/carDotComErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
    //       if (err) {
    //         throw err;
    //       } else {
    //         console.log("saved file");
    //       }
    //     });
    //     console.log(e);
    //     console.log(`There was an error with the while loop however data will still be saved... error happend on page ${currentPageNum}.. cars.com`);
    //     break;
    //   }
    // }

    // while(currentPageNum < 801){
    //   if (currentPageNum === 802) break;

    //   // Scrolling down to the bottom of page
    //   await page.evaluate(async () => {
    //     let scrollPosition = 0;
    //     let documentHeight = document.body.scrollHeight;

    //     while (documentHeight > scrollPosition) {
    //       window.scrollBy(0, documentHeight);
    //       await new Promise((resolve) => {
    //         setTimeout(resolve, 1000);
    //       });
    //       scrollPosition = documentHeight;
    //       documentHeight = document.body.scrollHeight;
    //       await new Promise((resolve) => {
    //         setTimeout(resolve, 1000);
    //       });
    //     }
    //   });

    //   // Try and Catch we going to grab all cards
    //   try{
    //     const carDotComData = await page.$$eval(".vehicle-card", (carCard)=>{
    //       return carCard.map((item)=>{
    //         let img = item.querySelector('div > div.vehicle-card-photos.js-gallery-click-gallery > cars-filmstrip > div > div:nth-child(1) > img')
    //         let title = item.querySelector('div > div.vehicle-details > a > h2')
    //         let mileage = item.querySelector('[data_qa="mileage"]')
    //         let price = item.querySelector('.primary-price')

    //         return {
    //           img: img?.src ?
    //           img?.src === "https://www.cars.com/images/placeholder_10x10.png" ? img.getAttribute('data-src') : img?.src : "",
    //           name_modal: title.textContent,
    //           mileage: `${mileage.textContent.replace(/([a-z])/gm, "").replace(/[.]/gm, "").replace(/^\s+|\s+$|\s+(?=\s)/g, "")} miles`,
    //           price: price.textContent
    //         }
    //       })
    //     })

    //     // Loop of scraped data and push into array
    //     for(const item of carDotComData){
    //       result.push(item)
    //     }

    //     // Pagination Section
    //     const pagginationBtns = await page.waitForSelector(`.sds-pagination__list`);
    //     const nextPageBtn = await page.$(`[aria-label="Go to Page ${currentPageNum + 1}"]`);
    //     const nextArrowBtn = await page.waitForSelector(`#next_paginate`);

    //     if (nextPageBtn) {
    //       await nextPageBtn.click();
    //       console.log("Clicked Btn Number");
    //     } else {
    //       await nextArrowBtn.click();
    //       console.log("Clicked Next Btn Arrow");
    //     }

    //     await new Promise((r) => setTimeout(r, 2000));

    //     const contentBody = await page.waitForSelector('.vehicle-card')

    //     // If the next page content body is loaded we contine otherwise we throw and error and break from while loop
    //     if (contentBody) {
    //       currentPageNum++;
    //       console.log(currentPageNum);
    //     } else {
    //       writeFile(`./data/carDotComErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
    //         if (err) {
    //           throw err;
    //         } else {
    //           console.log("saved file");
    //         }
    //       });
    //       console.log(`Got out of while loop on page ${currentPageNum} on content body check ... but we still saved the data`);
    //       break;
    //     }

    //   }catch(e){
    //     writeFile(`./data/carDotComErrorPage${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
    //       if (err) {
    //         throw err;
    //       } else {
    //         console.log("saved file");
    //       }
    //     });
    //     console.log(e);
    //     console.log(`There was an error with the while loop however data will still be saved... error happend on page ${currentPageNum}.. cars.com`);
    //     break;
    //   }
    // }

    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    // vehicle-card
    await page.screenshot({ path: "./screenshots/cars_com.jpg" });
    writeFile(`./data/carsDotComPage402-${currentPageNum}.json`, JSON.stringify(result), "utf-8", (err) => {
      if (err) {
        throw err;
      } else {
        console.log("saved file");
      }
    });

    await browser.close();
    res.send("hello");
  } catch (e) {
    console.log(e);
  }
}

export async function carsDotComData(req, res) {
  try {
    // const zero_To_100 = await promises.readFile("./data/carsDotComPage0-101.json", "utf-8");
    // const _102_To_206 = await promises.readFile("./data/carsDotComPage102-206.json", "utf-8");
    // const _207_To_301 = await promises.readFile("./data/carsDotComPage207-301.json", "utf-8");
    // const _301_To_401 = await promises.readFile("./data/carsDotComPage301-401.json", "utf-8");
    // const _402_To_601 = await promises.readFile("./data/carsDotComPage402-601.json", "utf-8");

    // let allCars = JSON.parse(zero_To_100).concat(JSON.parse(_102_To_206), JSON.parse(_102_To_206), JSON.parse(_207_To_301), JSON.parse(_301_To_401), JSON.parse(_402_To_601));
    // let me = allCarData.filter(item => item.name_modal.includes('Acura'))

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const result = allCarData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allCarData.length / limit);
    const data = {
      cars: result,
      page: page,
      limit: limit,
      totalPages,
      totalCount: allCarData.length,
    };

    res.send(data);
  } catch (e) {
    console.log(e);
  }
}

export async function removeDuplicateAndSaveAllData(req,res){
  try{

    res.send(removeDups(allCarData))

  }catch(e){
    console.log(e)
    res.status(400).json({msg:e.message})
  }
}

// Filter Async Function

export async function filterData(req, res) {
  try {
    const { price, sortByState, modal, page, mileage } = req.body;
    let data = allCarData;

    let newPrice = {
      ...price,
      highPrice: typeof price.highPrice === "string" ? Number(price.highPrice.replace(/[$,]/g, "")) : price.highPrice,
      lowPrice: typeof price.lowPrice === "string" ? Number(price.lowPrice.replace(/[$,]/g, "")) : price.lowPrice,
    };
    let newMileage = {
      ...mileage,
      lowMileage: typeof mileage.lowMileage === "string" ? Number(mileage.lowMileage.replace(/[,]/g, "")) : mileage.lowMileage,
      highMileage: typeof mileage.highMileage === "string" ? Number(mileage.highMileage.replace(/[,]/g, "")) : mileage.highMileage,
    };

    // Number(price.lowPrice.replace(/[$]/g, ""))
    // typeof price.highPrice === "string" ? Number(price.highPrice.replace(/[$]/g, "")) : price.highPrice,

    // We are also going to send or price state
    data = data.filter((item) => item.price >= newPrice.lowPrice && item.price <= newPrice.highPrice);

    // We are also going to filter on mileage
    data = data.filter((item) => item.mileage >= newMileage.lowMileage && item.mileage <= newMileage.highMileage);

    // We are also going to send our make and modal state ... maybe
    let newArr = [];
    for (let items in modal) {
      if (modal[items] === true) {
        newArr.push(items);
      }
    }
    let filterSection = {
      name_modal: newArr,
    };

    function filterPlainArray(array, filters) {
      const filterKeys = Object.keys(filters);
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
    const { searchVal } = req.body;

    function searchGeneretor(mockData, searchVal) {
      let firstD = mockData?.filter((item) => item.name_modal.slice(5, item.name_modal.length).toLowerCase().startsWith(searchVal.toLowerCase()));
      let secondD = mockData?.filter((item) => item.name_modal.toLowerCase().includes(searchVal.toLowerCase()));

      if (firstD?.length) {
        return firstD;
      } else {
        return secondD;
      }
    }

    res.send(searchGeneretor(data, searchVal).slice(0, 6));
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

    if(data){
      res.send(data);
    }else{
      return res.status(404).json({msg:"Sorry There is No Car with Provided Information"})
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

      res.status(200).json(sortedData?.slice(0,8));
    } else {
      res.status(404).json({ msg: "There was an error, we couldnt find similar cars" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}






