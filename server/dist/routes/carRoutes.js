import { Router } from "express";
import { filterData, relatedCarData, getOneCar, searchFunction, getCarVana, similarCars } from "../controller/carController.js";
import { removeDuplicateAndSaveAllData } from "../functions/removeDups.js";
import { carVanaData } from "../functions/getAllCarvanaData.js";
const router = Router();
// This function is my scrapper ... its really long so im not going to send it to github
router.get("/carvana", getCarVana);
router.post("/filter", filterData);
router.get("/related", relatedCarData);
router.post('/search', searchFunction);
router.post("/getOneCar", getOneCar);
router.post("/similar", similarCars);
// Using postman just to see data on my local computer
router.get("/fetchAllData", removeDuplicateAndSaveAllData);
// Not going to use this function anymore ... more likely just going to use it with postman on my local machine
router.post("/allCarvanaData", carVanaData);
export default router;
