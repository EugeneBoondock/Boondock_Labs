import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { summary } = await req.json();
    if (!summary) {
      return NextResponse.json({ error: 'No summary provided' }, { status: 400 });
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: 'New AI Chat Summary from Portfolio',
      text: summary,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to send email' }, { status: 500 });
  }
} 