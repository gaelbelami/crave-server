import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUserGuard } from 'src/auth/auth.user.guard';
import { AuthUser } from 'src/auth/auth.user.decorator';
import {
  CreateUserAccountInput,
  CreateUserAccountOutput,
} from './dtos/create-user-account.dto';
import { LoginUserInput, LoginUserOutput } from './dtos/login-user-account.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service'; 
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { EditUserProfileInput, EditUserProfileOutput } from './dtos/edit-user-profile.dto';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(returns => CreateUserAccountOutput)
  async createUserAccount(
    @Args('createUserAccountInput')
    createUserAccountInput: CreateUserAccountInput,
  ): Promise<CreateUserAccountOutput> {
    try {
      return await this.userService.createUserAccount(createUserAccountInput);
    } catch (error) {
      return {
        message: error,
        ok: false,
      };
    }
  }

  @Mutation(returns => LoginUserOutput)
  async loginUser(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<LoginUserOutput> {
    try {
      return this.userService.loginUser(loginUserInput);
    } catch (error) {
      return {
        ok: false,
        message: error,
      };
    }
  }

  @Query(returns => User)
  @UseGuards(AuthUserGuard)
  me(@AuthUser() loggedInUser: User) {
    return loggedInUser;
  }
 


  @UseGuards(AuthUserGuard)
  @Query(returns => UserProfileOutput)
  async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput>{
    try {
      const user = await this.userService.findById(userProfileInput.userId); 
      if(!user){
        throw Error();
      }
      return {
        ok: true,
        user,
      }
    } catch (error) {
      return {
        ok: false,
        message: 'User not found',
      }
    }
  }


  @UseGuards(AuthUserGuard)
  @Mutation(returns => EditUserProfileOutput)
  async editUserProfile(@AuthUser() loggedInUser: User,
   @Args('editUserProfileInput') editUserProfileInput: EditUserProfileInput): Promise<EditUserProfileOutput>{
      try {
        await this.userService.editUserProfile(loggedInUser.id, editUserProfileInput)
        return {
        ok: true,
        message: 'User info updated successfully'
      }
      } catch (error) {
        return {
          ok: false,
          message: error,
        }
      }
  }
}
 