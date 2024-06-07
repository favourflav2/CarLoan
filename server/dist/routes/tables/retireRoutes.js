import { Router } from "express";
import { create_Retire_Goal, insert_Fake_Retire_Data } from "../../controller/tables/retireTable/retireTable.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
const router = Router();
router.post("/createRetire", authMiddleware, create_Retire_Goal);
router.get("/fakeData", insert_Fake_Retire_Data);
export default router;
