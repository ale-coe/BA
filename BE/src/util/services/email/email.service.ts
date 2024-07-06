import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);

  async sendMail(to: string, subject: string, html: string) {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const _to = process.env.ENV === 'dev' ? process.env.BACKUP_EMAIL : to;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: _to,
      subject,
      html,
    });

    this.logger.log(`Email sent to ${_to}`);
  }
}
