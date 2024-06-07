 // Decided not use these functions becasue cars.com was sending images that wasnt filled... so im not using any cars from cars.com
 
 async function getCars_com(req, res) {
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
  
 async function carsDotComData(req, res) {
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