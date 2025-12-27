import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll() as Promise<User[]> | [];
  }

  @Query(() => User, { name: 'user', nullable: true })
  async getUserById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<User | null> {
    return this.usersService.findById(id) as Promise<User | null>;
  }

  @Query(() => User, { name: 'userByUsername', nullable: true })
  async getUserByUsername(
    @Args('username', { type: () => String }) username: string,
  ): Promise<User | null> {
    return this.usersService.findByUsername(username) as Promise<User | null>;
  }
}
