import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Profile } from './profile.model';
import { ProfilesService } from './profiles.service';

@Resolver(() => Profile)
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}

  @Query(() => Profile, { name: 'profile', nullable: true })
  async getProfile(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<Profile | null> {
    return this.profilesService.findByUserId(userId) as Promise<Profile | null>;
  }

  @Mutation(() => Profile)
  async updateProfile(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('bio', { type: () => String }) bio: string,
  ): Promise<Profile> {
    return this.profilesService.updateBio(userId, bio) as Promise<Profile>;
  }
}
