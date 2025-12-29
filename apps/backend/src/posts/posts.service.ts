import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post } from './post.model';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Post[]> {
    try {
      return (await this.prisma.post.findMany({
        include: {
          author: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          post_date: 'desc',
        },
      })) as Post[];
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async findAllByUser(username: string): Promise<Post[]> {
    try {
      return (await this.prisma.post.findMany({
        where: {
          author: {
            username,
          },
        },
        include: {
          author: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          post_date: 'desc',
        },
      })) as Post[];
    } catch (error) {
      console.error('Error fetching posts by user:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Post | null> {
    try {
      return (await this.prisma.post.findUnique({
        where: { id },
        include: {
          author: {
            include: {
              profile: true,
            },
          },
        },
      })) as Post | null;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  async create(data: {
    caption: string;
    img: string;
    size: 'rectangle' | 'square';
    type: string;
    authorId: string;
  }): Promise<Post> {
    try {
      return (await this.prisma.post.create({
        data,
        include: {
          author: {
            include: {
              profile: true,
            },
          },
        },
      })) as Post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<Post | null> {
    try {
      return (await this.prisma.post.delete({
        where: { id },
        include: {
          author: {
            include: {
              profile: true,
            },
          },
        },
      })) as Post;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
}
