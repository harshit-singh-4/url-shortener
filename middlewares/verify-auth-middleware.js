import { verifyjwttoken,refreshTokens } from "../services/auth.services.js";
import {ACCESS_TOKEN_EXPIRY,REFRESH_TOKEN_EXPIRY} from "../config/constant.js"

// export const verifyauthentication = (req, res, next) => {
//     const token = req.cookies.access_token;

//     if (!token) {
//         req.user = null;
//         return next();
//     }

//     try {
//         req.user = verifyjwttoken(token);
//     } catch (err) {
//         req.user = null;
//         res.clearCookie("access_token");
//     }

//     return next();
// };

export const verifyauthentication=async (req,res,next)=>{

  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token

  if(!accessToken && !refreshToken){
     req.user=null;
     return next();
  }

  if(accessToken){

   try{
    req.user= verifyjwttoken(accessToken);
    return next()
     }
    catch(err){
          req.user = null;
         // ❗ sirf tab clear karo jab refresh token hi nahi hai
           if (!refreshToken) {
             res.clearCookie("access_token");
             return next();
           }
     }
     
 }

 if(refreshToken){

     try{
      const {new_access_token,new_refresh_token,user} = await refreshTokens(refreshToken);
      req.user=user;
      
      const baseConfig = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      }
      
          res.cookie("access_token",new_access_token,{
              ...baseConfig,
              maxAge: ACCESS_TOKEN_EXPIRY*1000 // cookie take in millisec
          })
          res.cookie("refresh_token",new_refresh_token,{
              ...baseConfig,
              maxAge:REFRESH_TOKEN_EXPIRY*1000
          })

          return next();
    }
   catch(err){
      req.user=null;
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      console.log(err);
      return next();
   }
   
  }
  return next();
}
