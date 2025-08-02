import nodemailer from 'nodemailer';

// create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendWelcomeEmail(email: string, name: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to Pied Paper! 🎉',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin-bottom: 10px;">Pied Paper</h1>
          <p style="color: #666; font-size: 16px;">Welcome aboard! 🚀</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${name}! 👋</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Welcome to Pied Paper! You're now ready to start your 
            markdown journey with our powerful AI-assisted writing platform.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">What you can do now:</h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
              <li>Create up to 6 markdown projects</li>
              <li>Use AI for text completion and formatting</li>
              <li>Write technical documentation with ease</li>
              <li>Export your work in multiple formats</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/home" 
               style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: 500;">
              Start Writing
            </a>
          </div>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 12px;">
          <p>Happy writing! 📝</p>
          <p>The Pied Paper Team</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('welcome email sent successfully');
  } catch (error) {
    console.error('error sending welcome email-', error);
    // don't throw error for welcome email as it's not critical
  }
}
