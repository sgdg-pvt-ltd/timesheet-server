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
import { UserRole } from 'src/common/role';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { User } from 'src/users/entities/user.entity';
import { BcryptService } from 'src/common/modules/bcrypt/bcrypt.service';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService
  ) {}

  async sendInvitation(email: string, organizationId: string, role:UserRole): Promise<InvitationResponse> {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new HttpException(ErrorMessage.ORGANIZATION_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    const invitation = this.invitationRepository.create({ email, organizationId, role });
    await this.invitationRepository.save(invitation);
    
    const secretKey = this.configService.get<string>('JWT_SECRET_KEY');
    const token = jwt.sign({ invitationId: invitation.id, email, organizationId, role }, secretKey, {
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

  async acceptInvitation(token: string, acceptInvitationDto: AcceptInvitationDto): Promise<User> {
    const { password, confirmPassword } = acceptInvitationDto;
    
    const secretKey = this.configService.get<string>('JWT_SECRET_KEY');
    let payload: any;

    try {
      payload = jwt.verify(token, secretKey);
    } catch (e) {
      throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
    }

    const { invitationId, email } = payload;

    const invitation = await this.invitationRepository.findOne({ where: { id: invitationId, email } });
    if (!invitation) {
      throw new HttpException('Invalid invitation', HttpStatus.BAD_REQUEST);
    }

    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.bcryptService.hashingPassword(password);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      organizationId: invitation.organizationId,
      role: invitation.role,
    });

    await this.userRepository.save(user);
    await this.invitationRepository.remove(invitation);

    return user;
  }
}
