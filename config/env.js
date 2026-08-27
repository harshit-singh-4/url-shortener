import {z} from "zod";

 const envschema=z.object({
   PORT:z.coerce.number().default(3000),
    DATABASE_HOST:z.string(),
     DATABASE_USER:z.string(),
      DATABASE_PASSWORD:z.string(),
       DATABASE_NAME:z.string(),
})

export const env=envschema.parse(process.env);

// toh iska meaning hai:

//1. process.env ke andar jo env variables hain unko uthao
//2. schema ke hisaab se check karo
//3. agar sab sahi hai to parsed/validated object return karo
//4. agar kuch missing ya galat hai to error throw karo

// Iska fayda:

// - app start hote hi pata chal jaata hai ki env vars 
//   sahi hain ya nahi.
// - later runtime bugs kam hote hain.
// - config safer ho jaati hai.

// process.env -  ke andar bahut saari values hoti hain, lekin 
// .parse(process.env) sab ko blindly validate nahi karta. 
// Woh sirf schema mein defined keys ko check karta hai.
// baaki ignore karega .