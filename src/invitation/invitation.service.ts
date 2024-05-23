import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './entities/invitation.entity';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) {}

  async sendInvitation(email: string, organizationId: string): Promise<void> {
    // Save the invitation details to the database
    const invitation = this.invitationRepository.create({ email, organizationId });
    await this.invitationRepository.save(invitation);

    // Send the invitation email with a unique invitation link
    await this.sendInvitationEmail(email, invitation.id);
  }

  private async sendInvitationEmail(email: string, invitationId: string): Promise<void> {
    // Construct the invitation link using the invitationId
    const invitationLink = `${process.env.APP_URL}/signup?invitation=${invitationId}`;

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define the email content
    const mailOptions = {
      from: `"Your Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Invitation to Join Organization',
      text: `You have been invited to join the organization. Please sign up using the following link: ${invitationLink}`,
      html: `<p>You have been invited to join the organization. Please sign up using the following link: <a href="${invitationLink}">Sign Up</a></p>`,
    };

    // Send the invitation email
    await transporter.sendMail(mailOptions);

    console.log(`Invitation sent to ${email}`);
  }
}

