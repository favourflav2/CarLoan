import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { create_Car_Goal, update_Car_Goal, update_Car_Name } from "../../controller/tables/cartTables/carTables.js";

const router = Router()

router.post("/createCar",authMiddleware,create_Car_Goal)
router.put("/updateCar", authMiddleware, update_Car_Goal)
router.put("/updateCarName",authMiddleware, update_Car_Name)

export default router