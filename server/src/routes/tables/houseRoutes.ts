import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { create_House_Goal, delete_House_Goal, hide_And_Show_Inputs, update_House_Goal, update_House_Goal_Address, update_House_Goal_Img, update_House_Goal_Opp_Cost } from "../../controller/tables/houseTable/houseTable.js";

const router = Router()

router.post("/createHouseGoal",authMiddleware,create_House_Goal)
router.put("/updateHouse",authMiddleware, update_House_Goal)
router.delete("/deleteHouse", authMiddleware, delete_House_Goal)
router.put("/updateHouseOppCost",authMiddleware,update_House_Goal_Opp_Cost)
router.put("/updateHouseImg",authMiddleware, update_House_Goal_Img)
router.put("/updateHouseAddress",authMiddleware,update_House_Goal_Address)
router.put("/showInputs",authMiddleware, hide_And_Show_Inputs)

export default router