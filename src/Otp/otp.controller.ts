import { Controller, Post, Param } from '@nestjs/common';
import { OtpService } from './otp.service';
import * as nodemailer from 'nodemailer';

@Controller('otp')
export class OtpController {
  private transporter;

  constructor(private readonly otpService: OtpService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'devikaakp999@gmail.com',
        pass: 'sbwj ilqo cqtd uscv',
      },
    });
  }

  @Post('sendOTP/:email')
  async sendOTP(@Param('email') email: string): Promise<void> {
    const otp = this.otpService.generateOTP();
    this.otpService.storeOTP(email, otp);

    try {
      const mailOptions = {
        from: 'devikaakp999@gmail.com',
        to: email,
        subject: 'Your OTP',
        text: `Your one time password (OTP) is ${otp}. Please do not share this with anyone.`,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${email}`);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  @Post('validateOTP/:email/:otp')
  validateOTP(
    @Param('email') email: string,
    @Param('otp') otp: string,
  ): boolean {
    const storedOTP = this.otpService.getOTP(email);
    if (storedOTP && storedOTP === otp) {
      this.otpService.clearOTP(email);
      return true;
    }
    return false;
  }
}
