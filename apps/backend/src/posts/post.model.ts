import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../users/user.model';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  img: string;

  @Field()
  post_date: Date;

  @Field()
  size: 'tiny' | 'rectangle' | 'big';

  @Field()
  type: string;

  @Field()
  caption: string;

  @Field(() => User)
  author: User;

  @Field(() => ID)
  authorId: string;
}
