import { eq } from "drizzle-orm";
import {db} from "../config/db.js"
import {short_links} from "../drizzle/schema.js"


export const loadslinks =async (userid)=>{
         return await db.select().from(short_links).where(eq(short_links.usersid,userid));
}

  export  const saveLinks= async ({url,shortcode,userid})=>{
          
    await db.insert(short_links).values({
      shortcode:shortcode,
      url:url,
      usersid:userid
    })

  }

 export const getlinksbyshortcode= async (shortcode)=>{
             
    const value=await db.select().from(short_links).where(eq(short_links.shortcode,shortcode))

    if(value.length>0){
      return value[0];
    }
    else{
      return null;
    }
  

 }

 export const findshortlink=async (id)=>{
  const result = await db.select().from(short_links).where(eq(short_links.id,id));
  return result;
 }

 export const newshortcode= async (id,url,shortcode)=>{
      
  return await db.update(short_links)
  .set({
    
    shortcode:shortcode
  })
  .where(eq(short_links.id,id));

  
 }
 

  export const  deleteshortcodebyid =async(id)=>{
    return await db.delete(short_links).where(eq(short_links.id,id))
  }