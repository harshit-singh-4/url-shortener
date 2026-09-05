import { Router } from "express";
import {getregisterpage,getVerifyEmailPage,resendverificationlink,getloginpage,postlogin,postregister,getme,logoutuser,getProfilePage} from "../controllers/auth.controller.js"

const router= Router();

router.route("/register")
.get(getregisterpage)
.post(postregister);

// router.get("/login",getloginpage);

router.route("/login")
.get(getloginpage)
.post(postlogin)

router.route("/me")
.get(getme);

router.get("/profile",getProfilePage);

router.get("/verify-email",getVerifyEmailPage);

router.post("/resend-verification-link",resendverificationlink)

router.get("/logout",logoutuser)

export const authroutes=router;