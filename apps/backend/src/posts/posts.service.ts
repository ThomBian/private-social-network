import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { ConnectionService } from '../connection/connection.service';
import { Post } from './post.model';
import {
  ConnectionStatus,
  PostAudience,
  RelationGroup,
} from '../../generated/prisma/enums';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly connectionService: ConnectionService,
  ) {}

  async getFeedFor(viewerId: string): Promise<Post[]> {
    const postIds = await this.getFeedPostIds(viewerId);
    return this.getPostsWithDetails(postIds);
  }

  private async getFeedPostIds(viewerId: string): Promise<{ id: string }[]> {
    return this.prisma.$queryRaw`
      WITH combined_posts AS (
        select p."id", p."post_date" from "Post" p
        where p."authorId" = ${viewerId}
        
        UNION

        SELECT p."id", p."post_date" 
        FROM "Post" p
        INNER JOIN "Connection" c ON p."authorId" = c."ownerId"

        WHERE 
          c."viewerId" = ${viewerId} AND c."status" = ${ConnectionStatus.ACCEPTED}
      
        AND (
          p."audience" = ${PostAudience.ALL}
          OR (p."audience" = ${PostAudience.FRIENDS} AND c."group" In (${RelationGroup.FRIENDS}, ${RelationGroup.FAMILY}) )
          OR (p."audience" = ${PostAudience.FAMILY} AND c."group" = ${RelationGroup.FAMILY})
        )
      )
      SELECT cp."id"
      FROM combined_posts cp
    `;
  }

  async getProfileFeed(username: string, viewerId: string): Promise<Post[]> {
    const visitedUser = await this.usersService.findByUsernameLight(username);
    if (!visitedUser) return [];

    return visitedUser.id === viewerId
      ? this.getAllPostsByUser(visitedUser.id)
      : this.getPostsForConnectedUser(visitedUser, viewerId);
  }

  private async getPostsForConnectedUser(
    visitedUser: { id: string },
    viewerId: string,
  ): Promise<Post[]> {
    const connection = await this.connectionService.getApprovedConnection(
      visitedUser.id,
      viewerId,
    );
    if (!connection) return [];

    const postIds = await this.getVisiblePostIds(
      visitedUser.id,
      connection.group,
    );
    return this.getPostsWithDetails(postIds);
  }

  private async getAllPostsByUser(authorId: string): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: { authorId },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { post_date: 'desc' },
    });
    return posts as Post[];
  }

  private async getVisiblePostIds(
    authorId: string,
    group: RelationGroup,
  ): Promise<{ id: string }[]> {
    return this.prisma.$queryRaw`
      SELECT p."id" FROM "Post" p
      WHERE p."authorId" = ${authorId}
      AND (
        p."audience" = ${PostAudience.ALL}
        OR (p."audience" = ${PostAudience.FRIENDS} AND ${group} in (${RelationGroup.FRIENDS}, ${RelationGroup.FAMILY}) )
        OR (p."audience" = ${PostAudience.FAMILY} AND ${group} = ${RelationGroup.FAMILY} )
      )
      ORDER BY p."post_date" DESC
    `;
  }

  private async getPostsWithDetails(
    postIds: { id: string }[],
  ): Promise<Post[]> {
    if (postIds.length === 0) return [];

    return (await this.prisma.post.findMany({
      where: {
        id: { in: postIds.map((r) => r.id) },
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { post_date: 'desc' },
    })) as Post[];
  }

  async findById(id: string): Promise<Post | null> {
    return this.handleError(
      async () =>
        (await this.prisma.post.findUnique({
          where: { id },
          include: {
            author: {
              include: {
                profile: true,
              },
            },
          },
        })) as Post | null,
      'Error fetching post',
    );
  }

  async create(data: {
    caption: string;
    img: string;
    size: 'rectangle' | 'square';
    type: string;
    authorId: string;
  }): Promise<Post> {
    return this.handleError(
      async () =>
        (await this.prisma.post.create({
          data,
          include: {
            author: {
              include: {
                profile: true,
              },
            },
          },
        })) as Post,
      'Error creating post',
    );
  }

  async delete(id: string): Promise<Post | null> {
    return this.handleError(
      async () =>
        (await this.prisma.post.delete({
          where: { id },
          include: {
            author: {
              include: {
                profile: true,
              },
            },
          },
        })) as Post,
      'Error deleting post',
    );
  }

  private async handleError<T>(
    operation: () => Promise<T>,
    errorMessage: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error(errorMessage, error);
      throw error;
    }
  }
}
