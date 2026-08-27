import crypto from "crypto";
// import {saveLinks,loadslinks,getlinksbyshortcode}  from "../models/shortner.model.js";
import {saveLinks,loadslinks,getlinksbyshortcode,findshortlink,newshortcode,deleteshortcodebyid} from  "../services/shortener.services.js";
import fs from "fs/promises";
import path, { dirname } from "path"
import { fileURLToPath } from "url";
import z from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getshortnerpage=async(req,res)=>{
    if(!req.user){
        return res.redirect("/login")
    }
    
    try{
      
      const links= await loadslinks(req.user.id);

//       let cookies = req.headers.cookie;

// let isloggedin = cookies
//   ?.split(";")
//   .find((c) => c.trim().startsWith("isloggedin"))
//   ?.split("=")[1] === "true";

// console.log(isloggedin);

// new method by cooking-parser module

    //  console.log(req.cookies.islogin);

        res.render("../view/partials/index",{links,host:req.host});
    }
    catch(err){
       return res.status(500).send(err.message);
    }
}

export const posturlshortener=async(req,res)=>{
if(!req.user){
        return res.redirect("/login")
    }

    try{
    const{url,shortcode}=req.body;
    if (shortcode && !/^[a-zA-Z0-9_-]+$/.test(shortcode)) {
        return res.status(400).send("Shortcode can only contain letters, numbers, - and _");
    }
    const finalshortcode= shortcode || crypto.randomBytes(4).toString("hex"); // 8 character ka random string (kyunki 1 byte = 2 hex chars)
            
    const links= await getlinksbyshortcode(finalshortcode);
            if (!url) {
                return res.status(400).send("URL is required");
             }
             
            if(links){
                
                 req.flash("error","url with that shortcode is already exist use different");
                return res.redirect("/");
                }
            //  links[finalshortcode]=url;

            await saveLinks({url,shortcode:finalshortcode,userid:req.user.id});
            
            res.status(200).redirect("/")

    }
    catch(err){
       res.status(400).send(err.message)
    }

};

// redirct to link
export const redirectshortlink=async (req,res)=>{
    try{
        const {shortcode} = req.params;
        // const links= await loadslinks();
          const links= await getlinksbyshortcode(shortcode);
        if(!links){
            return res.send("error: NO SHORTCODE IS PRESENT IN DATABASE ");
        }
        return res.redirect(links["url"]);
    }
    catch(err){
        return res.status(500).send(err.message);
    }
}

export const getshortnereditpage = async (req,res)=>{
    const result = z.coerce.number().int().safeParse(req.params.id);

    if(!result.success){
        return res.send("404 error")
    }
   const id = req.params.id;

   try{
      const shortlink=await findshortlink(id);
      if(shortlink.length<=0){
        return res.send("error : not found in database")
        
      }
      res.locals.messages={
        id:shortlink[0].id,
        url:shortlink[0].url,
        shortcode:shortlink[0].shortcode
      }
      return res.render("../view/partials/edit-shortlink.ejs")
   }
   catch(err){
    console.log("error:",err);
   }


}

export const updateshortcode = async (req,res)=>{
     
    const {id} =req.params;
     const {url,shortcode}=req.body;

     try{
        await newshortcode(id,url,shortcode);
        return res.redirect("/");
     }
     catch(err){
       return  res.send(err)
     }
     
}

export const deleteshortcode = async (req,res)=>{
          const result = z.coerce.number().int().safeParse(req.params.id);

    if(!result.success){
        return res.send("404 error")
    }
   const id = req.params.id;

   try{
        await deleteshortcodebyid(id);
        return res.redirect("/");
     }
     catch(err){
       return  res.send(err)
     }

}