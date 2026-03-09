import { NextRequest, NextResponse } from 'next/server';

// POST handle contact form submission
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, phone, message } = data;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database if you want to store contact submissions
    // 2. Send an email notification to the admin
    // 3. Send an auto-reply email to the user
    
    // For now, we'll just log it and return success
    console.log('Contact form submission:', { name, email, phone, message });

    // In production, you would integrate with an email service like:
    // - Nodemailer
    // - SendGrid
    // - AWS SES
    // - Resend
    
    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
