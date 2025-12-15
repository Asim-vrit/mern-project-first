import db from "../../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../types/global-types";
import { queueEmail, transporter } from "../../utils/mailService";
import nodemailer from "nodemailer";
import { welcomeTemplate } from "../../templates/welcome";
import { generateOTP } from "../../utils/mathUtils";
import { registration_otp_template } from "../../templates/registration_otp";
async function login(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.body?.email || !req.body?.password) {
      next({
        status: 400,
        success: false,
        message: "Bad request",
      });
      return;
    }
    const { password, email } = req.body;
    const existingUser = await db.user.findFirst({
      where: { email },
    });

    if (!existingUser) {
      next({
        status: 401,
        success: false,
        message: "Email/Password doesnt match",
      });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      next({
        status: 401,
        success: false,
        message: "Email/Password doesnt match",
      });
      return;
    }

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        email: existingUser.email,
        id: existingUser.id,
        role: existingUser.role,
      },
      process.env.JWT_SECRET || ""
    );
    next({
      status: 200,
      success: true,
      message: "Logged in successfully!!",
      data: { token },
    });
  } catch (error) {
    next({ status: 500, success: false, message: "Something went wrong!!" });
  }
}

async function staffRegister(req: Request, res: Response) {
  try {
    if (!req.body?.email || !req.body?.password || !req.body?.name) {
      res.status(400).json({ error: "Bad request" });
      return;
    }
    const { password, email, name } = req.body;
    const existingUser = await db.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      res.status(401).json({ error: "User with this email already exists!!!" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.create({ data: { email, name, password: hashedPassword } });

    res.json({
      result: "Registration Successful",
    });
  } catch (error) {}
}
async function register(req: Request, res: Response) {
  try {
    if (!req.body?.email || !req.body?.password || !req.body?.name) {
      res.status(400).json({ error: "Bad request" });
      return;
    }
    const { password, email, name } = req.body;
    const existingUser = await db.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      res.status(401).json({ error: "User with this email already exists!!!" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    const otp = generateOTP();
    const existingTempUser = await db.tempUser.findFirst({
      where: { email: email },
    });
    if (existingTempUser) {
      await db.tempUser.update({
        where: { email: email },
        data: { otp: otp, expiry: now },
      });
    } else
      await db.tempUser.create({
        data: { email, name, password: hashedPassword, otp: otp, expiry: now },
      });

    const st = Date.now();
    // const info = await transporter.sendMail({
    //   from: `"Product team" <${process.env.EMAIL_USER}>`,
    //   to: email,
    //   subject: "Your registration OTP",
    //   text: "Here is your registration OTP",
    //   html: registration_otp_template(otp, name),
    // });
    await queueEmail(email, otp, name);

    const et = Date.now();

    const totalTime = et - st;
    console.log("Total time taken to send mail: " + totalTime);
    res.json({
      result: "OTP sent successfully",
    });
  } catch (error) {}
}
async function resendOtp(req: Request, res: Response) {
  try {
    if (!req.body?.email) {
      res.status(400).json({ error: "Bad request" });
      return;
    }
    const { email } = req.body;

    const existingTempUser = await db.tempUser.findFirst({
      where: { email: email },
    });
    if (!existingTempUser) {
      res.status(404).json({ error: "Email not found!" });
      return;
    }
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    const otp = generateOTP();
    await db.tempUser.update({
      where: { email: email },
      data: { otp: otp, expiry: now },
    });
    const info = await transporter.sendMail({
      from: `"Product team" <${process.env.EMAIL_USER}> `,
      to: email,
      subject: "Your registration OTP",
      text: "Here is your registration OTP ", // plain‑text body
      html: registration_otp_template(otp, existingTempUser.name), // HTML body
    });
    console.log(nodemailer.getTestMessageUrl(info));
    res.json({
      result: "OTP sent successfully",
    });
  } catch (error) {}
}
async function verifyRegistration(req: Request, res: Response) {
  try {
    if (!req.body?.email || !req.body?.otp) {
      res.status(400).json({ error: "Bad request" });
      return;
    }
    const { otp, email } = req.body;

    const existingTempUser = await db.tempUser.findFirst({
      where: { email },
    });

    if (!existingTempUser) {
      res.status(404).json({ error: "Email not found! Please register first" });
      return;
    }
    const now = new Date();

    if (otp !== existingTempUser.otp) {
      res.status(401).json("OTP is invalid!!");
      return;
    }

    if (now > existingTempUser.expiry) {
      res.status(400).json("OTP has expired please send again!!");
      return;
    }

    const newUser = await db.user.create({
      data: {
        email: existingTempUser.email,
        name: existingTempUser.name,
        password: existingTempUser.password,
      },
    });
    await db.tempUser.delete({ where: { email: existingTempUser.email } });

    const info = await transporter.sendMail({
      from: `"Product team" <${process.env.EMAIL_USER}> `,
      to: email,
      subject: "Your registration OTP",
      text: "Here is your registration OTP ", // plain‑text body
      html: welcomeTemplate(newUser.name), // HTML body
    });
    console.log(nodemailer.getTestMessageUrl(info));
    res.json({
      result: "User registration is successful!!!",
    });
  } catch (error) {}
}

async function getMe(req: AuthRequest, res: Response) {
  try {
    const id = req.user_id;
    const user = await db.user.findUnique({
      where: { id: id },
      select: {
        email: true,
        id: true,
        name: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
async function changePassword(req: AuthRequest, res: Response) {
  try {
    const id = req.user_id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    if (!oldPassword || !newPassword) {
      res
        .status(400)
        .json({ error: "Both old and new password are required!!" });
      return;
    }
    const user = await db.user.findUnique({ where: { id: id } });
    if (!user) {
      res.status(400).json({ error: "User doesnt exist" });
      return;
    }
    const doesOldPasswordMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!doesOldPasswordMatch) {
      res.status(400).json({ error: "Your old password does not match!!!" });
      return;
    }
    if (oldPassword === newPassword) {
      res.status(400).json({ error: "Old and new password cannot be same" });
      return;
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    await db.user.update({ where: { id: id }, data: { password: newHash } });
    res.json({ result: "Password is successfully changed!!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
    return;
  }
}

export {
  login,
  register,
  staffRegister,
  getMe,
  changePassword,
  resendOtp,
  verifyRegistration,
};
