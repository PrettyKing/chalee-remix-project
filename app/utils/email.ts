// app/utils/email.ts
import nodemailer from "nodemailer";

export async function sendResetPasswordEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.BASE_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
  });
}

