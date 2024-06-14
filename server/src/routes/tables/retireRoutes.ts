import { Router } from "express";
import { create_Retire_Goal, delete_Retire_Goal, insert_Fake_Retire_Data, update_RetireTable_Name, update_Retire_Table } from "../../controller/tables/retireTable/retireTable.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router()

router.post("/createRetire",authMiddleware,create_Retire_Goal)
router.post("/updateRetire",authMiddleware, update_Retire_Table)
router.put("/updateTitle", authMiddleware, update_RetireTable_Name)
router.delete("/deleteRetire",authMiddleware, delete_Retire_Goal)


router.get("/fakeData",insert_Fake_Retire_Data)

export default router