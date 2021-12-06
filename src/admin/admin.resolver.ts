import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthAdmin } from 'src/auth/auth.admin.decorator';
import { AuthAdminGuard } from 'src/auth/auth.admin.guard';
import { AdminService } from './admin.service';
import {
  CreateAdminAccountInput,
  CreateAdminAccountOutput,
} from './Dtos/create-admin-account.dto';
import { LoginAdminInput, LoginAdminOutput } from './Dtos/login-admin-account.dto';
import { Admin } from './entities/admin.entity';

@Resolver((of) => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation((returns) => CreateAdminAccountOutput)
  async createAdminAccount(
    @Args('createAdminAccountInput')
    createAdminAccountInput: CreateAdminAccountInput,
  ): Promise<CreateAdminAccountOutput> {
    try {
      return this.adminService.createAdminAccount(createAdminAccountInput);
    } catch (error) {
      return {
        ok: false,
        message: error,
      };
    }
  }


  @Mutation(returns => LoginAdminOutput)
  async loginAdmin(@Args('loginAdminInput') loginAdminInput: LoginAdminInput ) : Promise<LoginAdminOutput>{
    try {
      return this.adminService.loginAdmin(loginAdminInput);
    } catch (error) {
      return{
        ok: false,
        message: error,
      }
    }
  }


  @Query( returns => Admin)
  @UseGuards(AuthAdminGuard)
  async Admin(@AuthAdmin() loggedAmin: Admin){
    return loggedAmin;
  }
}
