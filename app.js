import path, { dirname } from "path"
import { fileURLToPath } from "url";

import {shortenroutes} from "./routes/shortner.routes.js";
import { authroutes } from "./routes/auth.routes.js";
import  {verifyauthentication} from "./middlewares/verify-auth-middleware.js"

import express from "express";
import session from "express-session";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import requestIp from "request-ip" 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port=process.env.PORT;
const app=express();
const isProduction = process.env.NODE_ENV === "production";


// sara data links.json ka 

// middleware

     app.use(express.static(path.join(__dirname,"public")));
     app.use(express.urlencoded({extended:true})); 
     
     // ejs
    app.set("view engine","ejs");
    // by default views folder
    // if the folder name diff from views then this 
    // views is key which is fix in express we cant change the name 
    // in other parameter we give path
    
    app.set("views",path.join(__dirname,"view")); // key value

//     Ye karta kya hai?

// 👉 Ye ek middleware register karta hai
// 👉 Simple words me:
// “Jo bhi request aaye, usme cookies ko parse (string → object) kar do”

    app.use(cookieParser());

    // session
    app.use(
        session({
           secret: process.env.SESSION_SECRET || "dev-session-secret",
           resave:false,
           saveUninitialized:false,
           cookie:{
            httpOnly:true,
            sameSite:"lax",
            secure:isProduction,
            maxAge: 1000 * 60 * 60
           }
        }) 
        )
    


    // flash messages
     app.use(flash());

     // for ip address
     app.use(requestIp.mw());

    app.use(verifyauthentication);

    app.use((req,res,next)=>{
       
        res.locals.user=req.user ?? null;
        res.locals.messages = {
            // it store data in res.locals.messages  
            // after reading the flash  data in session it 
            // delete it.
            success: req.flash("success"), // it return array
            error: req.flash("error")
        };
        next();
    })
     //  for authentication
    app.use(authroutes);
    // routing
     app.use(shortenroutes);    
     
     
    

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`)
})

// 🔄 Real-Life Flow (End-to-End)
// 1️⃣ Tum browser me likhte ho:
// http://localhost:3002/


// Browser bhejta hai:

// GET /

// 2️⃣ Server response deta hai:

// ➡ index.html

// 3️⃣ Browser HTML ko read karta hai

// HTML me hota hai:

// <link rel="stylesheet" href="/style.css">
// <script src="/script.js"></script>


// Browser khud ye requests bhejta hai:

// GET /style.css
// GET /script.js

// 4️⃣ Server in requests ka jawab deta hai:

// /style.css → CSS file

// /script.js → JS file

// ✅ Page properly styled + interactive ho jata hai

// 🔍 Line-Level Explanation (Short)
// http.createServer(...)


// ➡ HTTP server create karta hai

// if (req.method === "GET")


// ➡ Sirf GET requests allow karta hai

// if (req.url === "/")


// ➡ Home page serve karta hai

// fs.readFile(...)


// ➡ File system se file read karta hai

// res.writeHead(200, { "Content-Type": ... })


// ➡ Browser ko batata hai kis type ka data bhej rahe ho

// res.end(data)


// ➡ Response bhej kar request close karta hai

// 🧠 Important Concept Tumne Achha Seekh Liya

// ✅ HTTP stateless hota hai
// ✅ Har request pe server function phir se start hota hai
// ✅ Browser hi decide karta hai CSS/JS ki request bhejni hai
// ✅ Server sirf “jo mangoge wo dega”

// 💼 Interview Me Is Code Ko Kaise Explain Karoge?

// Best Answer:

// “This is a simple Node.js HTTP server that serves static files like HTML, CSS, and JavaScript using core modules without any framework.”

// ✅ Interviewer impress ✅

// 🎯 Is Code Se Tum Kya Ban Rahe Ho?

// Ye code sikhne ke baad tum:

// ✅ Node.js fundamentals samajh gaye

// ✅ Backend request / response cycle samajh gaye

// ✅ Express seekhne ke liye ready ho gaye

// Ye Junior Backend / Full-Stack Developer ka base hai 🔥

// 🚀 Express Se Relation Kya Hai?

// Express bas is ka short + smart version hai.

// Tum jo manually kar rahe ho:

// Routing

// Headers

// Static files

// Express ye sab automatically karta hai ✅

// 💼 INTERVIEW QUESTIONS & ANSWERS
// ✅ Q1. Ye code kis purpose ke liye use hota hai?

// Answer:
// Static website ko Node.js HTTP server ke through serve karne ke liye.

// ✅ Q2. Kya ye production ke liye use hota hai?

// Answer:
// Small projects ya learning ke liye theek hai, production me Express ya Nginx prefer kiya jata hai.

// ✅ Q3. Express use kyo nahi kiya?

// Answer:
// Core Node.js concepts samajhne ke liye bina framework ke code likha gaya hai.

// ✅ Q4. Browser CSS aur JS kaise maangta hai?

// Answer:
// Browser HTML parse karta hai aur link / script tags ke through alag HTTP requests bhejta hai.

// ✅ Q5. Is code ko scalable kaise banayenge?

// Answer:
// Express.js, middleware, aur static hosting use karke.

// ✅ Final One-Line Summary

// Ye code ek basic Node.js backend server hai jo browser ko HTML, CSS aur JS files serve karta hai — bina Express ke.

