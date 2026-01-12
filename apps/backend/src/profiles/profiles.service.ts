import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    try {
      return await this.prisma.profile.findUnique({
        where: { userId },
        include: {
          user: {
            include: {
              posts: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  async updateBio(
    userId: string,
    data: {
      bio?: string;
      firstName?: string;
      lastName?: string;
      location?: string;
    },
  ) {
    try {
      return await this.prisma.profile.update({
        where: { userId },
        data,
        include: {
          user: {
            include: {
              posts: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async create(userId: string, bio: string) {
    try {
      return await this.prisma.profile.create({
        data: {
          userId,
          bio,
        },
        include: {
          user: {
            include: {
              posts: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }
}
