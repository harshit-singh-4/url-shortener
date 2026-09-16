// import nodemailer from "nodemailer";
// // import send

// const testAccount= await nodemailer.createTestAccount();

// // Create a transporter using SMTP
// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// export const sendEmail = async({to,html,subject})=>{

//    const info = await transporter.sendMail({
//     from: `"URL SHORTENER" < ${testAccount.user} >`, // sender address
//     to,                                        // list of recipients
//     subject,                                   // subject line
//     html,                                      // HTML body
//   });
   
//   // ye test account hain ,means 
//   // Nodemailer, jo test email maine Ethereal par bheja hai, 
//   // usko browser mein dekhne ka preview URL deta h.
//   const testEmailUrl=nodemailer.getTestMessageUrl(info);
//   console.log(testEmailUrl);
// }

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendEmail = async ({ to, html, subject }) => {
    try {
        const info = await transporter.sendMail({
            from: `"URL SHORTENER" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Email sent:", info.messageId);

        
    } catch (err) {
        console.error("Email sending failed:", err);
        throw err;
    }
};