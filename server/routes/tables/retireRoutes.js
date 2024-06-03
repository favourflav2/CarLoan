import { Router } from "express";
import { create_Retire_Table, insert_Fake_Retire_Data } from "../../controller/tables/retireTable/retireTable.js";

const router = Router()

router.post("/createRetire", create_Retire_Table)
router.get("/fakeData",insert_Fake_Retire_Data)

export default router