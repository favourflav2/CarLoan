import { Router } from "express";
import { addCostOfLivingIndexTable, getCostOfLivingData } from "../controller/costOfLivingController.js";
const router = Router();
router.post('/addToCOLTable', addCostOfLivingIndexTable);
router.get("/getCostOfLivingData", getCostOfLivingData);
export default router;
