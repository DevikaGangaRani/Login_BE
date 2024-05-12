import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  private otpStore: Map<string, { otp: string; expiry: Date }> = new Map();

  generateOTP(): string {
    return Math.random().toString().slice(-6);
  }

  storeOTP(email: string, otp: string): void {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);

    this.otpStore.set(email, { otp, expiry });
  }

  getOTP(email: string): string | undefined {
    const otpInfo = this.otpStore.get(email);
    if (otpInfo && otpInfo.expiry > new Date()) {
      return otpInfo.otp;
    }
    return undefined;
  }

  clearOTP(email: string): void {
    this.otpStore.delete(email);
  }
}
