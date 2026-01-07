import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.model';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [Post], { name: 'feed' })
  async getFeed(@CurrentUser() user: User | null) {
    if (!user) return [];
    return await this.postService.getFeedFor(user.id);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [Post], { name: 'profilePosts' })
  async getProfileFeed(
    @CurrentUser() viewer: User | null,
    @Args('username', { type: () => String }) username: string,
  ) {
    if (!viewer) return [];
    return this.postService.getProfileFeed(username, viewer.id);
  }

  @Query(() => Post, { name: 'post', nullable: true })
  async getPost(@Args('id', { type: () => String }) id: string) {
    return await this.postService.findById(id);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Args('caption', { type: () => String }) caption: string,
    @Args('img', { type: () => String }) img: string,
    @Args('size', { type: () => String }) size: 'rectangle' | 'square',
    @Args('type', { type: () => String }) type: string,
    @CurrentUser() author: User | null,
  ) {
    if (!author) throw new Error('Unauthorized');

    return this.postService.create({
      caption,
      img,
      size,
      type,
      authorId: author.id,
    });
  }

  @Mutation(() => Post)
  async deletePost(@Args('id', { type: () => String }) id: string) {
    return this.postService.delete(id);
  }
}
