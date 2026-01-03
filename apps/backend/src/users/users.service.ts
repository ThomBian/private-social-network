import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../generated/prisma/client';
import { ConnectionService } from '../connection/connection.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly connectionService: ConnectionService,
  ) {}

  async findOrCreateUserByPhoneNumber(phoneNumber: string): Promise<User> {
    let user: User | null = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phoneNumber,
          username: `user-${phoneNumber.slice(-4)}`,
        },
      });
    }
    return user;
  }

  async findAll() {
    try {
      return await this.prisma.user.findMany({
        include: {
          profile: true,
          posts: true,
        },
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
        include: {
          profile: true,
          posts: true,
        },
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async findByUsername(username: string) {
    try {
      return await this.prisma.user.findFirst({
        where: { username },
        include: {
          profile: true,
        },
      });
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  }

  async findByUsernameLight(username: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { username },
      });
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  }
}
