export const registration_otp_template = (
  otp: number,
  name: string
) => `<!DOCTYPE html>
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
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Your OTP</h1>
                        </td>
                    </tr>
                    
                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Hi ${name},</h2>
                            
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                               Here is your registration OTP
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #666666; font-size: 18px; line-height: 1.6;">
                                ${otp}
                            </p>
                            
                            <!-- Features List -->
                           
                    
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
</html>`;
