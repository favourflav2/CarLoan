import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { create_Car_Goal } from "../../controller/tables/cartTables/carTables.js";

const router = Router()

router.post("/createCar",authMiddleware,create_Car_Goal)

export default router