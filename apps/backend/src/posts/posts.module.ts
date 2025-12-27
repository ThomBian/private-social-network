import { Module } from '@nestjs/common';
import { PostResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PostsService, PostResolver],
  exports: [PostsService],
})
export class PostsModule {}
