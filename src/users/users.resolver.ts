import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateUserAccountInput,
  CreateUserAccountOutput,
} from './dtos/create-user-account.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => Boolean)
  hi() {
    return true;
  }

  @Mutation(returns => CreateUserAccountOutput)
  async createUserAccount(
    @Args('createUserAccountInput')
    createUserAccountInput: CreateUserAccountInput,
  ): Promise<CreateUserAccountOutput> {
    try {
      const {ok, message } = await this.userService.createUserAccount(
        createUserAccountInput,
      );
      
      return {
        ok,
        message,
      };
    } catch (error) {
      return {
        message: error,
        ok: false,
      };
    }
  }
}
