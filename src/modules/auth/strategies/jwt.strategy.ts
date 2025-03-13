import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '@/modules/users/users.service';
import { IJwtPayload } from '@/shares/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: (req) => {
        if (req && req.cookies) {
          return req.cookies['access_token'];
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'Secret',
      passReqToCallback: true, 
    });
  }

  async validate(req: Request, payload: IJwtPayload) {
    const user = await this.userService.findUserbyEmail(payload.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return userResponse;
  }
}
