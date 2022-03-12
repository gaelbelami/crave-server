import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
import { DeleteUserAccountOutput } from './dtos/delete-user-account.dto';
import { ForgotUserPasswordInput, ForgotUserPasswordOutput } from './dtos/forgot-user-password.dto';
import { ResetPasswordUserInput, ResetPasswordUserOutput } from './dtos/reset-user-password.dto';
import { Role } from 'src/auth/role.decorator';
import { ChangePasswordUserInput, ChangePasswordUserOutput } from './dtos/change-password-user.dto';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

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


  @Role(['any'])
  @Query((returns) => User)
  async me(@AuthUser() loggedInUser: User) {
    console.log(loggedInUser)
    return loggedInUser;
  }

  //********************************************USER PROFILE RESOLVER**********************************************//
  //**************************************************************************************************************//

  @Query((returns) => UserProfileOutput)
  @Role(['any'])
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.userService.findUserById(userProfileInput.userId);
  }

  //********************************************DELETE USER ACCOUNT RESOLVER**********************************************//
  //**************************************************************************************************************//
  @Mutation(returns => DeleteUserAccountOutput)
  @Role(['any'])
  async deleteUserAccount(@AuthUser() loggedInUser: User): Promise<DeleteUserAccountOutput> {
    console.log(loggedInUser)
    return this.userService.deleteUserAccount(loggedInUser.id)
  }


  //**********************************************EDIT PROFILE RESOLVER********************************************//
  //**************************************************************************************************************//

  @Mutation((returns) => EditUserProfileOutput)
  @Role(['any'])
  async editUserProfile(
    @AuthUser() loggedInUser: User,
    @Args('editUserProfileInput') editUserProfileInput: EditUserProfileInput,
  ): Promise<EditUserProfileOutput> {

    return this.userService.editUserProfile( loggedInUser.id, editUserProfileInput );
  }

  //*********************************************VERIFY EMAIL RESOLVER*********************************************//
  //**************************************************************************************************************//

  @Mutation((returns) => VerifyEmailOutput)
  async verifyEmailUser(
    @Args('verifyEmailUserInput') { code }: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return this.userService.verifyEmailUser(code);
  }

  //*********************************************FORGOT USER PASSWORD RESOLVER*********************************************//
  //**************************************************************************************************************//


  @Mutation(returns => ForgotUserPasswordOutput)
  async forgotUserPassword(@Args('forgotUserPasswordInput') forgotUserPasswordInput: ForgotUserPasswordInput): Promise<ForgotUserPasswordOutput> {
    return this.userService.forgotPasswordUser(forgotUserPasswordInput)
  }

  //*********************************************RESET PASSWORD RESOLVER*********************************************//
  //**************************************************************************************************************//

  @Mutation(returns => ResetPasswordUserOutput)
  async resetPasswordUser(@Args('resetPasswordUserInput') resetPasswordUserInput: ResetPasswordUserInput): Promise<ResetPasswordUserOutput> {
    return this.userService.resetPasswordUser(resetPasswordUserInput);
  }
  
  
  //*********************************************CHANGE PASSWORD RESOLVER*********************************************//
  //**************************************************************************************************************//

  @Mutation(returns => ChangePasswordUserOutput)
  @Role(['any'])
  async changePasswordUser(@AuthUser() loggedInUser: User, @Args('changePasswordUserInput') changePasswordUserInput: ChangePasswordUserInput): Promise<ChangePasswordUserOutput> {
    return this.userService.changePasswordUser(loggedInUser.id, changePasswordUserInput);
  }
}
