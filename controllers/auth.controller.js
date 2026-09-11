import {deleteVerificationEmailToken,verifyUserEmailAndUpdate,getuserbyemail,findVerificationEmailToken,insertVerifyEmailToken,createVerifyEmailLink,generateRandomToken,getAllShortLinks,findUserById,createuser,hashpassword,compare,generatetoken,createsession,createRefreshToken,createAccessToken,clearUserSession} from "../services/auth.services.js"
import {registeruserschema,loginuserschema,verifyEmailSchema} from "../validators/auth-validators.js"
import { REFRESH_TOKEN_EXPIRY, ACCESS_TOKEN_EXPIRY } from "../config/constant.js";
import { sendEmail } from "../lib/nodemailer.js";

export const getregisterpage = (req,res)=>{
    
    return res.render("auth/register");
}

export const getloginpage = (req,res)=>{
    if(req.user){
        return res.redirect("/");
    }
    return  res.render("auth/login");
}

export const postlogin= async(req,res)=>{
    // cookie=

    // pehle hum aise karte the ab cookie-parser module aa gya hain
    // res.setHeader("Set-Cookie","isloggedin=true;  path=/;") 
    // // "isloggedin=true; key value baaki sab attribute (path,secure etc)

    // res.cookie("islogin","true");
    // res.redirect("/");

    // login check-

    const result = loginuserschema.safeParse(req.body);

    if(!result.success){
        req.flash("error",result.error.issues[0].message)
        return res.redirect("/login");
    }

    const {email,password}= req.body;

    const userexist = await getuserbyemail(email);
    
    if(userexist.length===0){
        req.flash("error","No account found with this email.");
        return res.redirect("/register");
    }

    const user = userexist[0];
    const verify=await compare(user.password,password);

    if(!verify){
        req.flash("error","Incorrect password. Please try again.");
        return res.redirect("/login");
    }

    // const token=generatetoken({
    //     id:user.id,
    //     name:user.name,
    //     email:user.email
    // })

    const [session] = await createsession(user.id,{
        ip: req.clientip
    })

    const accessToken = createAccessToken({
      id:user.id,
      name:user.name,
      isEmailValid:false,
      email:user.email,
      sessionid: session.id,
      
    })
    

    const refreshToken = createRefreshToken(session.id);
    
//     ...baseConfig kya hota hai?

// 🔥 Ye object ke saare properties ko copy/spread kar deta hai doosre object me

    const baseConfig = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }

    res.cookie("access_token",accessToken,{
        ...baseConfig,
        maxAge: ACCESS_TOKEN_EXPIRY*1000 // cookie take in millisec
    })
    res.cookie("refresh_token",refreshToken,{
        ...baseConfig,
        maxAge:REFRESH_TOKEN_EXPIRY*1000
    })

    // res.cookie("access_token",token,{
    //     httpOnly:true,
    //     sameSite:"lax",
    //     secure:process.env.NODE_ENV === "production",
    //     maxAge: 1000 * 60 * 60 * 24 * 30
    // });
    
    req.flash("success","Logged in successfully.");
    return res.redirect("/");

}

export const postregister = async (req,res)=>{
          
        //   const {Name,email,password}=req.body;
          
          const result = registeruserschema.safeParse(req.body);

          if(!result.success){
            req.flash("error",result.error.issues[0].message);
            return res.redirect("/register")
            
          }
            const {Name,email,password}=req.body;

          const userexist = await getuserbyemail(email);
          
          if(userexist.length>0){
            // it set the flash inside session
            req.flash("error","A user with this email already exists.");
            return res.redirect("/register")
          }
          
          const hashp= await hashpassword(password);

          await createuser({Name,email,password:hashp});

          req.flash("success","Account created successfully. Please log in.");
          return res.redirect("/login");
}

export const getme=(req,res)=>{
    if(!req.user){
        return res.send("NOT LOGGED IN")
    }
    return res.send(`Hey ${req.user.name} - ${req.user.email}`);
}

// this is used in logout 
export const logoutuser=async (req,res)=>{
    
    await clearUserSession(req.user.sessionid)
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
     req.flash("success","You have been logged out.");
     return res.redirect("/login");

}

export const getProfilePage = async(req,res)=>{
      const user = await findUserById(req.user.id);
      if(!user){
        return redirect("/login");
      }
    //   console.log(user)
    const [userShortLinks]= await getAllShortLinks(req.user.id);
    const stats = {
        totalUrls: userShortLinks.count,
        totalClicks: 342,
        activeLinks: 22,
        monthlyUrls: 8
    };

    const recentUrls = {};

    res.render("auth/profile", {
        user,
        stats,
        recentUrls
    });
   
}

export const getVerifyEmailPage = async (req, res) => {
    if (!req.user || req.user.isEmailValid) {
        return res.redirect("/");
    }

    return res.render("auth/verify-email", {
        email: req.user.email
    });

};

export const resendverificationlink=async(req,res)=>{
    if(!req.user || req.user.isEmailValid){
        res.redirect("/");
    }

    const randomToken=  generateRandomToken();

    await insertVerifyEmailToken({userId:req.user.id, token:randomToken});

    const verifyEmailLink= await createVerifyEmailLink({ 
        email:req.user.email,
        token:randomToken
        });

        sendEmail({
            to: req.user.email,
            subject:"verify your email",
            html: `
            <h1>click the link below</h1>
            <p>use the token : <code> ${randomToken}</code></p>
            <a href="${verifyEmailLink}">verify email</a>`
        })
    return res.redirect("/verify-email");
}

export const verifyEmailToken=(async(req,res)=>{
     
    const result=verifyEmailSchema.safeParse(req.query);

    if(!result.success){
        return res.status(400).send("verification link is invalid");
    }
    
    const {token,email}=result.data;

    const data=await findVerificationEmailToken(result.data);

    if(!data){
         return res.status(400).send("Invalid or expired verification link");
    }
    await verifyUserEmailAndUpdate(data[0].email);
    await deleteVerificationEmailToken(token);
    return res.redirect("/profile");
})