import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConnectionStatus, RelationGroup } from '../../generated/prisma/enums';
import { Connection } from '../../generated/prisma/client';
import { User } from '../users/user.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class ConnectionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async requestFollow(
    username: string,
    viewer: User | null,
  ): Promise<Connection | null> {
    if (!viewer) {
      throw new Error('Authentication required to request follow');
    }

    if (username === viewer.username) {
      throw new Error('Owner and viewer cannot be the same');
    }

    const owner = await this.usersService.findByUsernameLight(username);

    if (!owner) {
      throw new Error('User not found');
    }

    const existingConnection = await this.prismaService.connection.findUnique({
      where: {
        ownerId_viewerId: { ownerId: owner.id, viewerId: viewer.id },
      },
    });

    if (existingConnection) {
      throw new Error(
        'Follow request already exists or you are already connected',
      );
    }

    return await this.prismaService.connection.create({
      data: {
        ownerId: owner.id,
        viewerId: viewer.id,
        status: ConnectionStatus.PENDING,
        group: RelationGroup.OTHERS,
      },
    });
  }

  async approveFollow(
    ownerId: string,
    viewerId: string,
    group: RelationGroup,
  ): Promise<Connection> {
    return await this.prismaService.connection.update({
      where: {
        ownerId_viewerId: { ownerId, viewerId },
      },
      data: {
        status: ConnectionStatus.ACCEPTED,
        group,
      },
    });
  }

  async cancelFollow(
    followerId: string,
    username: string,
  ): Promise<Connection | null> {
    const owner = await this.usersService.findByUsernameLight(username);

    if (!owner) {
      throw new Error('User not found');
    }

    return await this.prismaService.connection.delete({
      where: { ownerId_viewerId: { ownerId: owner.id, viewerId: followerId } },
    });
  }

  async getApprovedConnection(
    ownerId: string,
    viewerId: string,
  ): Promise<{ group: RelationGroup } | null> {
    if (!ownerId) return null;

    const connection = await this.prismaService.connection.findUnique({
      where: {
        ownerId_viewerId: { ownerId: ownerId, viewerId },
      },
    });

    return connection?.status === ConnectionStatus.ACCEPTED ? connection : null;
  }

  async getConnection(
    ownerId: string,
    viewerId: string,
  ): Promise<Connection | null> {
    const connection = await this.prismaService.connection.findUnique({
      where: {
        ownerId_viewerId: { ownerId: ownerId || '', viewerId },
      },
    });

    return connection;
  }
}
