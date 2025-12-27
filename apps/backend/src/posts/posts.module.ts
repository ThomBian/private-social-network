import { Module } from '@nestjs/common';
import { PostResolver } from './posts.resolver';
import { PostsService } from './posts.service';

@Module({
  imports: [],
  providers: [PostsService, PostResolver],
  exports: [PostsService],
})
export class PostsModule {}
