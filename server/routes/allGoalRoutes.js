import { Router } from "express";
import { delete_From_All_Tables, get_All_Tables } from "../controller/tables/allGoalTables.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router()

router.get("/allGoals", authMiddleware,get_All_Tables)
router.delete("/delete",authMiddleware,delete_From_All_Tables)


export default router;