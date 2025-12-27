import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from '../posts/post.model';
import { Profile } from '../profiles/profile.model';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field(() => Profile, { nullable: true })
  profile?: Profile;

  @Field(() => [Post], { nullable: true })
  posts?: Post[];
}
