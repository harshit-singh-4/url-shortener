import { count,eq } from "drizzle-orm";
import {db} from "../config/db.js"
import {users,sessionstable, short_links} from "../drizzle/schema.js"
import argon2 from "argon2";
import jwt from "jsonwebtoken"
import session from "express-session";
import { REFRESH_TOKEN_EXPIRY, ACCESS_TOKEN_EXPIRY } from "../config/constant.js";

export const getuserbyemail = async(email)=>{
    const data=  await db.select().from(users).where(eq(users.email,email))
    console.log(data);
    return data;
 }

export const createuser = async({Name,email,password})=>{
    return await db.insert(users).values(
        {
            name:Name,
            email:email,
            password:password
        }
    )
}

export const createsession = async (id,{ip})=>{
           
    return await db.insert(sessionstable).values({
        userid: id,
        ip:ip
    }).$returningId();
}

export const hashpassword=async (password)=>{

    return await argon2.hash(password); 
}

export const compare= async (hashp,password)=>{
    return await argon2.verify(hashp,password);
}

export const createAccessToken = ({id,name,email,sessionid})=>{
               
    return jwt.sign({id,name,email,sessionid},process.env.JWT_SRCRET,{
        expiresIn:  ACCESS_TOKEN_EXPIRY
    })
}

export const createRefreshToken = (sessionid)=>{
               
    return jwt.sign({sessionid},process.env.JWT_SRCRET,{
        expiresIn:REFRESH_TOKEN_EXPIRY 
    })
}

export const generatetoken=({id,name,email})=>{
    return jwt.sign({id,name,email},process.env.JWT_SRCRET,{
        expiresIn:"2d"
    })
};

export const verifyjwttoken=(token)=>{
    return jwt.verify(token,process.env.JWT_SRCRET);
}

const findSessonById = async (sessionId)=>{
       
    const [sessionData]= await db.select().from(sessionstable).where(eq(sessionstable.id,sessionId))
    
    return sessionData;
}

// find how many short link user create

export const getAllShortLinks=async (id)=>{
    
    return  await db.select({count:count()})
    .from(short_links)
    .where(eq(short_links.usersid,id))
}

export const findUserById=async (userid)=>{
   
    const [userData]= await db.select().from(users).where(eq(users.id,userid));
    
    return userData;
}

export const refreshTokens= async (refreshToken)=>{
     try{
       const session= verifyjwttoken(refreshToken);
       const sessionData= await findSessonById(session.sessionid);

       if(!sessionData || !sessionData.valid){
        throw new Error("invalid session");
       }
        
       const userData= await findUserById(sessionData.userid);

       if(!userData){
        throw new Error("invalid user")
       }

       const userinfo={
        id:userData.id,
        name:userData.name,
        email:userData.email,
        isEmailValid:userData.isEmailValid,
        sessionid:session.sessionid
    }
       
    const new_access_token= createAccessToken(userinfo)
 
    const new_refresh_token=createRefreshToken(session.sessionid)

    return  {new_access_token,new_refresh_token,user:userinfo}

     }
    catch(err){
       console.log(err);
       throw err;
    }

    
}

export const clearUserSession=async (sessionid)=>{
   return await db.delete(sessionstable).where(eq(sessionstable.id,sessionid));
}