import db from "../../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { AuthRequest } from "../../types/global-types";
import { transporter } from "../../utils/mailService";
import nodemailer from "nodemailer";
async function login(req: Request, res: Response) {
  try {
    if (!req.body?.email || !req.body?.password) {
      res.status(400).json({ error: "Bad request" });
      return;
    }
    const { password, email } = req.body;
    const existingUser = await db.user.findFirst({
      where: { email },
    });

    if (!existingUser) {
      res.status(401).json({ error: "Email/Password doesnt match" });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Email/Password doesnt match" });
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
    res.json({
      result: "Login Successful",
      token: token,
    });
  } catch (error) {}
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
    await db.user.create({
      data: { email, name, password: hashedPassword, role: "USER" },
    });
    const info = await transporter.sendMail({
      from: `"Product team" <${process.env.EMAIL_USER}> `,
      to: email,
      subject: "Welcome to our product app",
      text: "Welcome to our product app", // plain‑text body
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our App</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Welcome Aboard! 🎉</h1>
                        </td>
                    </tr>
                    
                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Hi there,</h2>
                            
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                We're thrilled to have you join our community! Your account has been successfully created, and you're all set to explore everything our app has to offer.
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                Here's what you can do next:
                            </p>
                            
                            <!-- Features List -->
                            <table role="presentation" style="width: 100%; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                                        <p style="margin: 0; color: #667eea; font-weight: bold; font-size: 16px;">✓ Complete your profile</p>
                                        <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Add your details to personalize your experience</p>
                                    </td>
                                </tr>
                                <tr><td style="height: 10px;"></td></tr>
                                <tr>
                                    <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                                        <p style="margin: 0; color: #667eea; font-weight: bold; font-size: 16px;">✓ Explore features</p>
                                        <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Discover all the tools available to you</p>
                                    </td>
                                </tr>
                                <tr><td style="height: 10px;"></td></tr>
                                <tr>
                                    <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                                        <p style="margin: 0; color: #667eea; font-weight: bold; font-size: 16px;">✓ Get started</p>
                                        <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Jump right in and start using the app</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="https://yourapp.com/dashboard" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">Get Started Now</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Help Section -->
                    <tr>
                        <td style="padding: 30px; background-color: #f8f9fa; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; text-align: center;">
                                Need help getting started? We're here for you!
                            </p>
                            <p style="margin: 0; color: #666666; font-size: 14px; text-align: center;">
                                <a href="https://yourapp.com/support" style="color: #667eea; text-decoration: none;">Visit our Help Center</a> or 
                                <a href="mailto:support@yourapp.com" style="color: #667eea; text-decoration: none;">contact support</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #333333;">
                            <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px;">
                                © 2024 YourApp. All rights reserved.
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                You received this email because you signed up for YourApp.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
            </html>`, // HTML body
    });
    console.log(nodemailer.getTestMessageUrl(info));
    res.json({
      result: "Registration Successful",
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

export { login, register, staffRegister, getMe, changePassword };
