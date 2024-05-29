export interface SendEmailDto {
    from?: string;
    recipients: string;
    subject: string;
    html: string;
  }
  