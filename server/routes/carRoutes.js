import { Router } from "express";
import { carVanaData, carsDotComData, filterData, getCarVana, getCars_com, getOneCar, relatedCarData, removeDuplicateAndSaveAllData, searchFunction, similarCars } from "../controller/carController.js";

const router = Router()

router.get("/carvana",getCarVana)
router.post("/allCarvanaData",carVanaData)
router.get("/carsDotCom",getCars_com)

router.get("/allCarsDotCom",carsDotComData)

router.post("/filter",filterData)
router.get("/related", relatedCarData)

router.post('/search',searchFunction)
router.post("/getOneCar",getOneCar)

router.post("/similar",similarCars)

router.get("/fetchAllData",removeDuplicateAndSaveAllData)

export default router