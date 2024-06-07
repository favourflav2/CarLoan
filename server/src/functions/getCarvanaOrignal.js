export async function getCarVanaOriginal(req, res) {
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