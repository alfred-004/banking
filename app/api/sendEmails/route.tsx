import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    const requestData = await req.json(); // Parse JSON request body
    const { userEmail, userName, totalBudget, totalSpent } = requestData;
    if (!userEmail || !totalBudget || !totalSpent) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    const mailOptions = {
      from: {
        name: "BankFlow",
        address: process.env.EMAIL_USER,
      },
      to: userEmail,
      subject: "⚠️ Budget Limit Exceeded – Immediate Action Required",
      text: `Dear ${userName}, Your expenses have exceeded your budget limit! 
      Total Spent: $${totalSpent} | Budget: $${totalBudget}. 
      Please review your spending.`,
      html: `<p>Dear <strong>${userName}</strong>,</p>
             <p>Your expenses have exceeded your budget limit!</p>
             <p>Total Spent: <strong>$${totalSpent}</strong></p>
             <p>Budget: <strong>$${totalBudget}</strong></p>
             <p>Please review your spending.</p>`,
    };
    
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully", info }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Email sending failed", error }, { status: 500 });
  }
}

export async function GET(req) {
  // Simple hello text response without database access
  return NextResponse.json({ message: "Hello! The email notification service is running." }, { status: 200 });
}