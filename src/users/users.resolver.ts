import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateUserAccountInput,
  CreateUserAccountOutput,
} from './dtos/create-user-account.dto';
import { LoginUserInput, LoginUserOutput } from './dtos/login-user-account.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => Boolean)
  hi() {
    return true;
  }

  @Mutation(returns => CreateUserAccountOutput)
  async createUserAccount(
    @Args('createUserAccountInput')
    createUserAccountInput: CreateUserAccountInput,
  ): Promise<CreateUserAccountOutput> {
    try {
      return await this.userService.createUserAccount(
        createUserAccountInput,
      );
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
}
