import { Router } from "express";
import { add_Content_Creator, add_Video_Link, get_All_Content_Creators, get_All_Vidoe_Links_By_Id, } from "../../controller/tables/contentCreator/contentCreatorTable.js";


const router = Router()

router.post("/addCreator", add_Content_Creator)
router.post("/addVideoLink", add_Video_Link)


router.get("/getAllCreators", get_All_Content_Creators )
router.post("/getVideoLinks", get_All_Vidoe_Links_By_Id)

export default router