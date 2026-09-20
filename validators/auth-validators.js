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

export const verifyEmailSchema=z.object({
    
    token: z.string().trim().length(8),
    email:z.string().trim().email(),

})

export const verifyPasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current Password is required!" }),
    newPassword: z
      .string()
      .min(6, { message: "New Password must be at least 6 characters long." })
      .max(100, {
        message: "New Password must be no more than 100 characters.",
      }),
    confirmPassword: z
      .string()
      .min(6, {
        message: "Confirm Password must be at least 6 characters long.",
      })
      .max(100, {
        message: "Confirm Password must be no more than 100 characters.",
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Error will be associated with confirmPassword field
  });