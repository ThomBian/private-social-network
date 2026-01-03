import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from '../users/user.model';
import { PostAudience, PostSize } from '../../generated/prisma/enums';

registerEnumType(PostAudience, {
  name: 'PostAudience',
});

registerEnumType(PostSize, {
  name: 'PostSize',
});

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  img: string;

  @Field()
  post_date: Date;

  @Field(() => PostSize)
  size: PostSize;

  @Field()
  type: string;

  @Field()
  caption: string;

  @Field(() => User)
  author: User;

  @Field(() => ID)
  authorId: string;

  @Field(() => PostAudience)
  audience: PostAudience;
}
