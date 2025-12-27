import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/user.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Number)
  async requestPhoneVerificationCode(
    @Args('phoneNumber') phoneNumber: string,
  ): Promise<number> {
    const code = await this.authService.requestPhoneCode(phoneNumber);
    return code;
  }

  @Mutation(() => User, { nullable: true })
  async loginWithPhoneCode(
    @Args('phoneNumber') phoneNumber: string,
    @Args('code') code: number,
  ): Promise<User | null> {
    const user = await this.authService.loginWithPhoneCode(phoneNumber, code);
    return user;
  }
}
