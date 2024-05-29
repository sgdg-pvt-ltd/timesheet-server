import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './entities/invitation.entity';
import { MailerService } from '../mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { Organization } from 'src/organization/entities/organization.entity';
import ErrorMessage from 'src/common/error-message';
import { InvitationResponse } from './dto/invitation-response.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendInvitation(email: string, organizationId: string): Promise<InvitationResponse> {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new HttpException(ErrorMessage.ORGANIZATION_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    const invitation = this.invitationRepository.create({ email, organizationId });
    await this.invitationRepository.save(invitation);
    
    const secretKey = this.configService.get<string>('JWT_SECRET_KEY');
    const token = jwt.sign({ invitationId: invitation.id, email, organizationId }, secretKey, {
      expiresIn: '1h',
    });
    await this.sendInvitationEmail(email, invitation.id);
    return {invitation, token};
  }

  private async sendInvitationEmail(email: string, invitationId: string): Promise<void> {
    const invitationLink = `${this.configService.get<string>('APP_URL')}/signup?invitation=${invitationId}`;
    const mailOptions = {
      recipients: email,
      subject: 'Invitation to Join Organization',
      html: `<p>You have been invited to join the organization. Please sign up using the following link: <a href="${invitationLink}">Sign Up</a></p>`,
    };

    await this.mailerService.sendEmail(mailOptions);
    console.log(`Invitation sent to ${email}`);
  }
}
