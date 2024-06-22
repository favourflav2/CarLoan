import { Router } from "express";
import { add_Content_Creator } from "../../controller/tables/contentCreator/contentCreatorTable.js";


const router = Router()

router.post("/addCreator", add_Content_Creator)

export default router