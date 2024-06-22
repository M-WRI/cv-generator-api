import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const msg = {
  to: "me@moritzwright.com",
  from: {
    email: process.env.EMAIL_FROM!,
    name: "Your Service Name",
  },
  subject: "Test Email",
  text: "This is a test email from your Node.js application.",
  html: "<strong>This is a test email from your Node.js application.</strong>",
};

sgMail
  .send(msg)
  .then(() => {
    console.log("Test email sent successfully");
  })
  .catch((error) => {
    console.error(
      "Error sending test email:",
      error.response ? error.response.body.errors : error
    );
  });
