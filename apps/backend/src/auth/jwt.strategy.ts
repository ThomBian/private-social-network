import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as PassportJwtStrategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './auth.service';
import { User } from '../../generated/prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub || payload.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user as User;
  }
}
