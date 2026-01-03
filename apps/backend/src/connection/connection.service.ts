import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConnectionStatus, RelationGroup } from '../../generated/prisma/enums';
import { Connection } from '../../generated/prisma/client';

@Injectable()
export class ConnectionService {
  constructor(private readonly prismaService: PrismaService) {}

  async requestFollow(ownerId: string, viewerId: string): Promise<boolean> {
    if (ownerId === viewerId) {
      throw new Error('Owner and viewer cannot be the same');
    }

    await this.prismaService.connection.upsert({
      where: {
        ownerId_viewerId: { ownerId, viewerId },
      },
      update: {
        status: ConnectionStatus.PENDING,
      },
      create: {
        ownerId,
        viewerId,
        status: ConnectionStatus.PENDING,
        group: RelationGroup.OTHERS,
      },
    });

    return true;
  }

  async approveFollow(
    ownerId: string,
    viewerId: string,
    group: RelationGroup,
  ): Promise<boolean> {
    await this.prismaService.connection.update({
      where: {
        ownerId_viewerId: { ownerId, viewerId },
      },
      data: {
        status: ConnectionStatus.ACCEPTED,
        group,
      },
    });
    return true;
  }

  async declineFollow(ownerId: string, viewerId: string): Promise<boolean> {
    await this.prismaService.connection.delete({
      where: {
        ownerId_viewerId: { ownerId, viewerId },
      },
    });
    return true;
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
