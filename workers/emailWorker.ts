import { Worker } from "bullmq";
import { registration_otp_template } from "../templates/registration_otp";
import { transporter } from "../utils/mailService";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

const emailWorker = new Worker(
  "email",
  async (job) => {
    console.log(`Processing email job ${job.id}`);

    const { email, otp, name } = job.data;

    try {
      await transporter.sendMail({
        from: `"Product team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your registration OTP",
        text: "Here is your registration OTP",
        html: registration_otp_template(otp, name),
      });
      console.log(`Email sent successfully to ${email}`);
      return { success: true, email };
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  },
  { connection }
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with error: ${err.message}`);
});

export default emailWorker;
