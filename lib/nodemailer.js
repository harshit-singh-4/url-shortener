import nodemailer from "nodemailer";

const testAccount= await nodemailer.createTestAccount();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async({to,html,subject})=>{

   const info = await transporter.sendMail({
    from: `"URL SHORTENER" < ${testAccount.user} >`, // sender address
    to,                                        // list of recipients
    subject,                                   // subject line
    html,                                      // HTML body
  });
   
  const testEmailUrl=nodemailer.getTestMessageUrl(info);
  console.log(testEmailUrl);
}