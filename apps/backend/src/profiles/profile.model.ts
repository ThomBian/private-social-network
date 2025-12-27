import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../users/user.model';

@ObjectType()
export class Profile {
  @Field(() => ID)
  id: string;

  @Field()
  bio: string;

  @Field(() => ID)
  userId: string;

  @Field(() => User)
  user: User;
}
