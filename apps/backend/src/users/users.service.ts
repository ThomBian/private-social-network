import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateUserByPhoneNumber(phoneNumber: string): Promise<User> {
    let user: User | null = await this.prisma.user.findUnique({
      where: { phoneNumber },
      include: { profile: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phoneNumber,
          username: `user-${phoneNumber.slice(-4)}`,
          profile: {
            create: {},
          },
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

  async queryUsers(query: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { phoneNumber: { contains: query, mode: 'insensitive' } },
          { profile: { firstName: { contains: query, mode: 'insensitive' } } },
          { profile: { lastName: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        profile: true,
      },
      take: 10,
    });
  }
}
