import { Module } from '@nestjs/common';
import { PostResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { UsersModule } from '../users/users.module';
import { ConnectionModule } from '../connection/connection.module';

@Module({
  imports: [UsersModule, ConnectionModule],
  providers: [PostsService, PostResolver],
  exports: [PostsService],
})
export class PostsModule {}
