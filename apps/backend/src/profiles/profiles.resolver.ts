import {
  Args,
  ID,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';
import { Profile } from './profile.model';
import { UpdateProfileInput } from './input-type/update-profile.input';

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
    @Args('data') data: UpdateProfileInput,
  ): Promise<Profile> {
    return this.profilesService.updateBio(userId, data) as Promise<Profile>;
  }

  @ResolveField(() => String, { name: 'fullName' })
  resolveFullName(profile: Profile): string {
    const firstname = profile?.firstName || '';
    const lastName = profile.lastName || '';

    return `${firstname} ${lastName}`.trim();
  }
}
