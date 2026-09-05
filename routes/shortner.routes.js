import {getshortnerpage,posturlshortener,redirectshortlink,getshortnereditpage,updateshortcode,deleteshortcode} from "../controllers/postshortener.controller.js";
import express from "express";

const router=express.Router();


// 7️⃣ Key points

// req → IncomingMessage → Readable stream → emits 'data' & 'end'
// res → ServerResponse → Writable stream → write() + end() send data to client
// Server emits 'request' internally when HTTP headers parsed
// Node.js is non-blocking + event-driven → multiple clients ek saath handle ho sakte hain

// html , home page
router.get("/",getshortnerpage);

// data from user if they submit and store in links
router.post("/",posturlshortener);

router.route("/update/:id")
.post(updateshortcode) 


// ejs ex
// ye exercise hain not related to this project
router.get("/about",(req,res)=>{
    const student={
        name:"harshit singh",
        class:12,
        age:22
    }
    res.render("../view/partials/result",{student});
   
    
})

// edit shortcode page
router.route("/edit/:id")
.get(getshortnereditpage);

// delete shortcode and url
// 🎯 Interview Questions 🔥
// 1️⃣ Why should we not use GET for delete?

// 👉 Answer:
// Because GET should be idempotent and safe, meaning it should not modify server data.

router.route("/delete/:id")
.post(deleteshortcode);

//redirectin
router.get("/:shortcode",redirectshortlink);

//named export
export const shortenroutes=router ;
