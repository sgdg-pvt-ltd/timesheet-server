import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { SendEmailDto } from './mail.interface';
import { CreateEmailResponseSuccess } from './resend-response.interface';

@Injectable()
export class MailerService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('Resend API key is not configured');
    }
    this.resend = new Resend(resendApiKey);
  }

  async sendEmail(dto: SendEmailDto): Promise<CreateEmailResponseSuccess> {
    const { from, recipients, subject, html } = dto;
    const fromAddress = typeof from === 'string' ? from : `${from?.name} <${from?.address}>`;

    if (!fromAddress.match(/^[^@]+@[^@]+\.[^@]+$|^[^@]+<[^@]+@[^@]+\.[^@]+>$/)) {
      throw new Error('Invalid `from` field. The email address needs to follow the `email@example.com` or `Name <email@example.com>` format.');
    }

    try {
      const response = await this.resend.emails.send({
        from: fromAddress,
        to: Array.isArray(recipients) ? recipients : [recipients],
        subject,
        html,
      });

      if (response.error) {
        console.error('Error sending email', response.error);
        throw new Error('Failed to send email');
      }

      return response.data as CreateEmailResponseSuccess;
    } catch (error) {
      console.error('Error sending email', error);
      throw error;
    }
  }
}
