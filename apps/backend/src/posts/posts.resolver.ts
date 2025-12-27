import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Post } from './post.model';
import { PostsService } from './posts.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostsService) {}

  @Query(() => [Post], { name: 'feed' })
  async getFeed(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @Query(() => [Post], { name: 'profilePosts' })
  async getProfileFeed(
    @Args('username', { type: () => String }) username: string,
  ): Promise<Post[]> {
    return this.postService.findAllByUser(username);
  }

  @Query(() => Post, { name: 'post', nullable: true })
  async getPost(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Post | null> {
    return this.postService.findById(id);
  }

  @Mutation(() => Post)
  async createPost(
    @Args('caption', { type: () => String }) caption: string,
    @Args('img', { type: () => String }) img: string,
    @Args('size', { type: () => String }) size: 'tiny' | 'rectangle' | 'big',
    @Args('type', { type: () => String }) type: string,
    @Args('authorId', { type: () => String }) authorId: string,
  ): Promise<Post> {
    return this.postService.create({
      caption,
      img,
      size,
      type,
      authorId,
    });
  }

  @Mutation(() => Post)
  async deletePost(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Post | null> {
    return this.postService.delete(id);
  }
}
