import { Field, ObjectType } from '@nestjs/graphql';
import { ConnectionStatus, RelationGroup } from '../../generated/prisma/enums';

@ObjectType()
export class Connection {
  @Field()
  status: ConnectionStatus;

  @Field()
  group: RelationGroup;
}
