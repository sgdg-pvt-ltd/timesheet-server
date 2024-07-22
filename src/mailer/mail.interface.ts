export interface SendEmailDto {
  from?: { name: string; address: string } | string;
  recipients: string | string[];
  subject: string;
  html: string;
}
