import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  bio: string;

  @Field(() => ID)
  userId: string;

  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  fullName?: string;

  @Field({ nullable: true })
  location: string;
}
