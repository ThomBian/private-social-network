import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { User } from '../users/user.model';
import { PrismaService } from '../prisma/prisma.service';

const EXPIRATION_TIME_SECONDS = 5 * 60; // 5 minutes

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
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
  ): Promise<User | null> {
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

    let user = await this.prismaService.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          phoneNumber,
          username: `user-${phoneNumber.slice(-4)}`,
        },
      });
    }

    return user as User;
  }
}
