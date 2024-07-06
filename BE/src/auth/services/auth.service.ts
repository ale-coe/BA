import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ESource } from '@shared/source.enum';
import { compareSync, hashSync } from 'bcrypt';
import { Request } from 'express';
import { JwtPayload, decode, sign, verify } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { InvitationEntity } from '../../database/entities/invitation.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { SQL_ERROR_CODES } from '../../util/constants';
import { EmailService } from '../../util/services/email/email.service';
import { LoginDto } from '../dto/post-login.dto';
import { RegisterDto } from '../dto/post-register.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(InvitationEntity)
    private readonly invitationRepo: Repository<InvitationEntity>,
    private readonly emailService: EmailService,
  ) {}

  async registerUserWithEmailAndPassword(body: RegisterDto) {
    const user = await this.insertNewUser(body);
    if (!user) return;

    // TODO_1: should happen after activation, not after registration
    await this.handleInvitationCode(body.invitationCode);
    await this.sendActivationMail(user);
  }

  async insertNewUser({
    email,
    password,
  }: RegisterDto): Promise<UserEntity | null> {
    try {
      const user = await this.userRepo.save({
        email,
        password: hashSync(password, 10),
        source: ESource.EMAIL,
      });

      return user;
    } catch (error) {
      if (SQL_ERROR_CODES[error.errno]) {
        this.logger.warn(`Duplicate record prevented: ${email}`);
        return null;
      }

      this.logger.error(error, AuthService.name);
      throw new InternalServerErrorException();
    }
  }

  async sendActivationMail(user: UserEntity) {
    try {
      const activationCode = uuidv4();
      const subject =
        'Willkommen bei Cash4Trash - Danke, dass du der Umwelt hilfst';
      const html = `<h1>Willkommen bei Cash4Trash</h1><p>Bevor Du deinen Account nutzen kannst, logge dich bitte ein und nutze den Aktivierungscode ${activationCode}.</p><p>Dein Cash4Trash-Team</p>`;

      await this.emailService.sendMail(user.email, subject, html);
      await this.userRepo.save({ ...user, activationCode });
    } catch (error) {
      // TODO_1: set flag to send mail via cronjob
      this.logger.error(`Activationmail not send for ${user.email}`);
    }
  }

  async handleInvitationCode(invitationCode: string) {
    if (!invitationCode) return;

    await this.invitationRepo.update(
      { invitationCode },
      { invitationSuccessful: 1 },
    );
  }

  async login(body: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: body.email, disabled: 0 },
    });

    if (!user) {
      this.logger.warn(`Login attempt failed for ${body.email}`);
      throw new UnauthorizedException();
    }

    if (user.source !== ESource.EMAIL) {
      this.logger.warn(`Login attempt for social login ${body.email}`);
      throw new UnauthorizedException();
    }

    const compareResult = compareSync(body.password, user.password);

    if (!compareResult) {
      this.logger.warn(`Login attempt with wrong password for ${body.email}`);
      throw new UnauthorizedException();
    }

    return this.createJWT(user);
  }

  createJWT({ email, userId, userRole }: UserEntity): [Date, string] {
    let expiresIn: string | number = 100 * 86_400_000;
    const expires = new Date(Date.now() + expiresIn);

    return [
      expires,
      sign({ email, userId, userRole }, process.env.SUPER_SECRET, {
        expiresIn,
      }),
    ];
  }

  decodeJwt(token: string) {
    return decode(token) as JwtPayload;
  }

  async checkIfValidAndActiveUser(req: Request) {
    const token = this.extractTokenFromHeader(req);
    this.verifyToken(token);
    const decodedToken = this.decodeJwt(token);

    const user = await this.userRepo.findOne({
      where: { userId: decodedToken.userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return !!user.activated;
  }

  extractTokenFromHeader(req: Request) {
    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedException();
    }

    return token;
  }

  verifyToken(token: string) {
    try {
      verify(token, process.env.SUPER_SECRET);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async getUserRole(userId: number) {
    const user = await this.userRepo.findOne({ where: { userId } });

    if (!user) {
      throw new BadRequestException();
    }

    return user.userRole;
  }
}
