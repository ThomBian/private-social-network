import { Args, ID, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Parent } from '@nestjs/graphql';
import { Connection } from '../connection/connection.model';
import { ConnectionService } from '../connection/connection.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly connectionService: ConnectionService,
  ) {}

  @Query(() => [User], { name: 'searchUsers' })
  async getUsers(
    @Args('query', { type: () => String }) query: string,
  ): Promise<User[]> {
    return this.usersService.queryUsers(query) as Promise<User[]> | [];
  }

  @Query(() => User, { name: 'user', nullable: true })
  async getUserById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<User | null> {
    return this.usersService.findById(id) as Promise<User | null>;
  }

  @Query(() => User, { name: 'userByUsername', nullable: true })
  async getUserByUsername(
    @Args('username', { type: () => String }) username: string,
  ): Promise<User | null> {
    return this.usersService.findByUsername(username) as Promise<User | null>;
  }

  @UseGuards(GqlJwtAuthGuard)
  @ResolveField(() => Connection, { nullable: true, name: 'connectionToMe' })
  async connectionToMe(
    @CurrentUser() viewer: User,
    @Parent() user: User,
  ): Promise<Connection | null> {
    if (!viewer || user.id === viewer.id) {
      return null;
    }

    return await this.connectionService.getConnection(user.id, viewer.id);
  }
}
