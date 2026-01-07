import { Field, ObjectType } from '@nestjs/graphql';
import { ConnectionStatus, RelationGroup } from '../../generated/prisma/enums';
import { User } from '../users/user.model';

@ObjectType()
export class Connection {
  @Field()
  id: string;

  @Field()
  status: ConnectionStatus;

  @Field()
  group: RelationGroup;

  @Field(() => User)
  viewer?: User;
}
