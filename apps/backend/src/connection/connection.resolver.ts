import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ConnectionService } from './connection.service';
import { RelationGroup } from '../../generated/prisma/enums';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.model';
import { Connection } from './connection.model';

@Resolver()
export class ConnectionResolver {
  constructor(private readonly connectionService: ConnectionService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Connection)
  async requestFollow(
    @Args('username') username: string,
    @CurrentUser() viewer: User | null,
  ): Promise<Connection | null> {
    return await this.connectionService.requestFollow(username, viewer);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Connection)
  async approveFollow(
    @CurrentUser() owner: User,
    @Args('followerId') followerId: string,
    @Args('group') group: string,
  ): Promise<Connection | null> {
    return await this.connectionService.approveFollow(
      owner.id,
      followerId,
      group as RelationGroup,
    );
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Connection)
  async cancelFollow(
    @CurrentUser() follower: User,
    @Args('username') username: string,
  ): Promise<Connection | null> {
    return await this.connectionService.cancelFollow(follower.id, username);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [Connection])
  async connectionRequests(@CurrentUser() owner: User): Promise<Connection[]> {
    return await this.connectionService.connectionRequests(owner.id);
  }
}
