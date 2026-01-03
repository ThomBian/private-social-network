import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './auth.payload';

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

  @Mutation(() => AuthPayload)
  async loginWithPhoneCode(
    @Args('phoneNumber') phoneNumber: string,
    @Args('code') code: number,
  ): Promise<AuthPayload | null> {
    return await this.authService.loginWithPhoneCode(phoneNumber, code);
  }
}
