import { Router } from "express";
import { signUp, check_Otp_Value, forgot_Password, logIn, practiceToken, reset_Password } from "../controller/authController.js";
import rateLimit from "express-rate-limit";
import { resetPasswordMiddleware } from "../middleware/authMiddleware.js";
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // maximum number of requests allowed in the windowMs
    handler: function (req, res, next) {
        return res.status(429).json({
            msg: "Too many requests, please try again later.",
        });
    },
});
const router = Router();
router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/forgotPassword", forgot_Password);
router.post("/checkOtp", limiter, resetPasswordMiddleware, check_Otp_Value);
router.post("/resetPassword", resetPasswordMiddleware, reset_Password);
router.get("/fav", practiceToken);
export default router;
