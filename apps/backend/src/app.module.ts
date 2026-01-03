import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import type { Request } from 'express';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { ConnectionModule } from './connection/connection.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: (authService: AuthService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: true,
        csrfPrevention: false,
        context: ({ req }: { req: Request }) => {
          // Extract token from Authorization header
          const authHeader = req.headers['authorization'];

          let userId: string | undefined;

          if (
            typeof authHeader === 'string' &&
            authHeader.startsWith('Bearer ')
          ) {
            const token = authHeader.substring(7);
            const decoded = authService.verifyToken(token);
            if (decoded) {
              userId = decoded.sub || decoded.id;
            }
          }

          return {
            req,
            userId,
          };
        },
      }),
    }),
    RedisModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    PostsModule,
    ConnectionModule,
  ],
})
export class AppModule {}
