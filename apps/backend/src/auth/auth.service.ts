import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { User } from '../users/user.model';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

const EXPIRATION_TIME_SECONDS = 5 * 60; // 5 minutes

export interface JwtPayload {
  sub: string;
  id: string;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async requestPhoneCode(phoneNumber: string): Promise<number> {
    const code = Math.floor(1000 + Math.random() * 9000);

    await this.redisClient.set(
      `opt-phone-${phoneNumber}`,
      code,
      'EX',
      EXPIRATION_TIME_SECONDS,
    ); // Code valid for 5 minutes

    console.log(`Sending code ${code} to phone number ${phoneNumber}`);
    return code;
  }

  async loginWithPhoneCode(
    phoneNumber: string,
    code: number,
  ): Promise<{ user: User; token: string } | null> {
    const storedCode = await this.redisClient.get(`opt-phone-${phoneNumber}`);

    if (!storedCode) {
      console.log('No code found or code expired');
      return null;
    }

    if (storedCode !== code.toString()) {
      console.log('Invalid code provided');
      return null;
    }

    await this.redisClient.del(`opt-phone-${phoneNumber}`);

    const user = (await this.usersService.findOrCreateUserByPhoneNumber(
      phoneNumber,
    )) as User;

    const payload: JwtPayload = {
      sub: user.id,
      id: user.id,
      username: user.username,
    };

    return {
      user: user,
      token: this.jwtService.sign(payload),
    };
  }

  /**
   * Verify and decode a JWT token
   */
  verifyToken(
    token: string,
  ): { sub: string; id: string; username: string } | null {
    try {
      const decoded = this.jwtService.verify(token) as unknown as {
        sub: string;
        id: string;
        username: string;
      };
      return decoded;
    } catch {
      return null;
    }
  }
}
