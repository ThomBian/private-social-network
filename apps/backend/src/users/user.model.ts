import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from '../posts/post.model';
import { Profile } from '../profiles/profile.model';
import { Connection } from '../connection/connection.model';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;

  @Field()
  createdAt: Date;

  @Field(() => Profile)
  profile: Profile;

  @Field(() => [Post], { nullable: true })
  posts?: Post[];

  @Field({ nullable: true })
  connectionToMe?: Connection;
}
