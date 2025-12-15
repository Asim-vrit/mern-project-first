import nodemailer from "nodemailer";
import { emailQueue } from "../workers/emailQueue";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const queueEmail = async (email: string, otp: number, name: string) => {
  await emailQueue.add("send-email", {
    email,
    otp,
    name,
  });

  console.log("Email queued successfully");
};

export { transporter, queueEmail };
