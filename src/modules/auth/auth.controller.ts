import { Controller, Post, UseGuards, Request, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(req.user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
    });
    return { message: 'Successfully logged in' };
  }

  @Get('debug')
  @UseGuards(JwtAuthGuard)
  debugToken(@Request() req) {
    console.log('Debug endpoint - Request user:', req.user);
    console.log('Debug endpoint - Cookies:', req.cookies);
    
    return {
      user: req.user,
      cookies: req.cookies,
      hasRole: !!req.user?.role,
      role: req.user?.role,
    };
  }
}