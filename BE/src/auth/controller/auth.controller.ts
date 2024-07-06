import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { BypassTokenGuard } from '../decorators/bypass-token-guard.decorator';
import { UserId } from '../decorators/user-id.decorator';
import { LoginDto as PostLoginDto } from '../dto/post-login.dto';
import { RegisterDto as PostRegisterDto } from '../dto/post-register.dto';
import { AuthService } from '../services/auth.service';
import { BypassActivatedGuard } from '../decorators/bypass-activated-guard.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @BypassActivatedGuard()
  @BypassTokenGuard()
  @Post('register')
  async register(@Body() body: PostRegisterDto) {
    await this.authService.registerUserWithEmailAndPassword(body);
  }

  @BypassActivatedGuard()
  @BypassTokenGuard()
  @Post('login')
  async login(@Body() body: PostLoginDto, @Res() res: Response) {
    const [expires, token] = await this.authService.login(body);

    // needs withCredentials in request
    res.cookie('token', token, {
      httpOnly: true,
      expires,
      sameSite: process.env.ENV === 'prod',
      secure: process.env.ENV === 'prod',
    });

    res.send();
  }

  @BypassActivatedGuard()
  @BypassTokenGuard()
  @Get('validate')
  checkToken(@Req() request: Request) {
    return this.authService.checkIfValidAndActiveUser(request);
  }

  @Get('use-role')
  getUserRole(@UserId() userId: number) {
    return this.authService.getUserRole(userId);
  }

  @Get('user-id')
  getUserId(@UserId() userId: number) {
    return userId;
  }

  @Get('logout')
  logout(@Res() res: Response) {
    const expires = new Date(0);

    res.cookie('token', '', {
      httpOnly: true,
      expires,
    });

    res.send();
  }
}
