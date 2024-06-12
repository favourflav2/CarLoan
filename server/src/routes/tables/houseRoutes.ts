import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { create_House_Goal } from "../../controller/tables/houseTable/houseTable.js";

const router = Router()

router.post("/createHouseGoal",authMiddleware,create_House_Goal)

export default router