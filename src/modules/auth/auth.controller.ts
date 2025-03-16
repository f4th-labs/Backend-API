import { Controller, Post, UseGuards, Request, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Response } from 'express';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/responses/login-response.dto';
import { LogoutResponseDto } from './dto/responses/logout-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiBody({ 
    description: 'User credentials',
    examples: {
      example1: {
        value: {
          email: 'user@example.com',
          password: 'password123'
        },
        summary: 'User login credentials'
      }
    }
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const { access_token, user } = await this.authService.login(req.user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return {
      message: 'Successfully logged in',
      user,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
    type: LogoutResponseDto,
  })
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogoutResponseDto> {
    res.clearCookie('access_token');
    return { message: 'Successfully logged out' };
  }

  @Get('debug')
  @UseGuards(JwtAuthGuard)
  debugToken(@Request() req) {
    return {
      user: req.user,
      cookies: req.cookies,
      hasRole: !!req.user?.role,
      role: req.user?.role,
    };
  }
}
