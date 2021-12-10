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
import {
  EditUserProfileInput,
  EditUserProfileOutput,
} from './dtos/edit-user-profile.dto';
import {
  VerifyEmailInput,
  VerifyEmailOutput,
} from 'src/verification/dtos/user.verification.dto';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  //********************************************CREATE ACCOUNT RESOLVER********************************************//
  //**************************************************************************************************************//

  @Mutation((returns) => CreateUserAccountOutput)
  async createUserAccount(
    @Args('createUserAccountInput')
    createUserAccountInput: CreateUserAccountInput,
  ): Promise<CreateUserAccountOutput> {
    return this.userService.createUserAccount(createUserAccountInput);
  }

  //************************************************LOGIN RESOLVER*************************************************//
  //**************************************************************************************************************//

  @Mutation((returns) => LoginUserOutput)
  async loginUser(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<LoginUserOutput> {
    return this.userService.loginUser(loginUserInput);
  }

  //****************************************AUTHENCTICATED USER RESOLVER*******************************************//
  //**************************************************************************************************************//

  @Query((returns) => UserProfileOutput)
  @UseGuards(AuthUserGuard)
  me(@AuthUser() loggedInUser: User) {
    console.log(loggedInUser);
    return loggedInUser;
  }

  //********************************************USER PROFILE RESOLVER**********************************************//
  //**************************************************************************************************************//

  @UseGuards(AuthUserGuard)
  @Query((returns) => UserProfileOutput)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.userService.findUserById(userProfileInput.userId);
  }

  //**********************************************EDIT PROFILE RESOLVER********************************************//
  //**************************************************************************************************************//

  @UseGuards(AuthUserGuard)
  @Mutation((returns) => EditUserProfileOutput)
  async editUserProfile(
    @AuthUser() loggedInUser: User,
    @Args('editUserProfileInput') editUserProfileInput: EditUserProfileInput,
  ): Promise<EditUserProfileOutput> {
    return this.userService.editUserProfile(
      loggedInUser.id,
      editUserProfileInput,
    );
  }

  //*********************************************VERIFY EMAIL RESOLVER*********************************************//
  //**************************************************************************************************************//

  @Mutation((returns) => VerifyEmailOutput)
  async verifyEmailUser(
    @Args('verifyEmailUserInput') { code }: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return this.userService.verifyEmailUser(code);
  }
}
