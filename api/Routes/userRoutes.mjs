import express from "express";
const router = express.Router();
import tokenVerification from "../middlewareFolder/tokenVerification.mjs";

import {add_User, all_Users, edit_User, delete_User, userLogin} from "../Controller/userController.mjs";

router.get("/user",all_Users);
router.post("/user", add_User);
router.put("/user/:userid", edit_User);
router.delete("/user/:userid", delete_User);
router.post("/user/login", userLogin);
router.get("/user/me", tokenVerification);
export default router;