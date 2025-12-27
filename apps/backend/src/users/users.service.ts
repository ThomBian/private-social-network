import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
          posts: true,
        },
      });
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  }

  async create(data: { username: string; email: string }) {
    try {
      return await this.prisma.user.create({
        data,
        include: {
          profile: true,
          posts: true,
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
}
