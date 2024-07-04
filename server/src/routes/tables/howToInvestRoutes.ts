import { Router } from "express";
import { add_Book, add_Content_Creator, add_Video_Link, get_All_Books, get_All_Content_Creators, get_All_Vidoe_Links_By_Id, update_Book_Img, update_Content_Creator_Img, } from "../../controller/tables/howToInvest/howToInvestTable.js";


const router = Router()

// Dev routes for creating data
router.post("/addCreator", add_Content_Creator)
router.post("/addVideoLink", add_Video_Link)
router.post("/addBook", add_Book)
router.post("/updateBookImg", update_Book_Img)
router.post("/updateContentCreatorImg", update_Content_Creator_Img)

// Routes being used
router.get("/getAllCreators", get_All_Content_Creators )
router.post("/getVideoLinks", get_All_Vidoe_Links_By_Id)
router.get("/getAllBooks",get_All_Books)

export default router