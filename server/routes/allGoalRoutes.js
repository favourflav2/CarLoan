import { Router } from "express";
import { get_All_Tables } from "../controller/tables/allGoalTables.js";

const router = Router()

router.get("/allGoals", get_All_Tables)


export default router;