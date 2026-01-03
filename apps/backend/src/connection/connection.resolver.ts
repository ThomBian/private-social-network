import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ConnectionService } from './connection.service';
import { RelationGroup } from '../../generated/prisma/enums';

@Resolver()
export class ConnectionResolver {
  constructor(private readonly connectionService: ConnectionService) {}

  @Mutation(() => Boolean)
  async requestFollow(
    @Args('ownerId') ownerId: string,
    @Args('viewerId') viewerId: string,
  ): Promise<boolean> {
    // Placeholder implementation
    return await this.connectionService.requestFollow(ownerId, viewerId);
  }

  @Mutation(() => Boolean)
  async approveFollow(
    @Args('ownerId') ownerId: string,
    @Args('viewerId') viewerId: string,
    @Args('group') group: string,
  ): Promise<boolean> {
    // Placeholder implementation
    return await this.connectionService.approveFollow(
      ownerId,
      viewerId,
      group as RelationGroup,
    );
  }

  @Mutation(() => Boolean)
  async declineFollow(
    @Args('ownerId') ownerId: string,
    @Args('viewerId') viewerId: string,
  ): Promise<boolean> {
    // Placeholder implementation
    return await this.connectionService.declineFollow(ownerId, viewerId);
  }
}
