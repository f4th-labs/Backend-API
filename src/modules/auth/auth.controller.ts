import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(req.user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
    });
    return { message: 'Successfully logged in' };
  }
}