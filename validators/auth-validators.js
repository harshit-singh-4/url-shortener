import z from "zod"


export const loginuserschema= z.object({
  

    email: z.string()
    .trim()
    .email({message:"please enter a valid email address."})
    .max(100,{message:"email must be no more than 100 character."}),

    password: z.string()
    .min(6,{message:"password must be at least 6 character long"})
    .max(100,{message:"password must be no more than 100 characters."})
}
)

export const registeruserschema= loginuserschema.extend({
    Name: z.string()
    .trim()
    .min(3,{message:"Name must be at least 3 characters long."})
    .max(100,{message:"Name must be no more than 100 characters."}),

  
}
)