import { Router } from "express";
import { get_All_Tables } from "../controller/tables/allGoalTables.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();
router.get("/allGoals", authMiddleware, get_All_Tables);
export default router;
