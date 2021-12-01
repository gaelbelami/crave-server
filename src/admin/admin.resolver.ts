import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { CreateAdminAccountInput, CreateAdminAccountOutput } from './Dtos/create-admin-account.dto';
import { Admin } from './entities/admin.entity';

@Resolver(of => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(returns => CreateAdminAccountOutput)
    async createAdminAccount(@Args('createAdminAccountInput') createAdminAccountInput: CreateAdminAccountInput): Promise<CreateAdminAccountOutput>{
      try {
        return this.adminService.createAdminAccount(createAdminAccountInput);
      } catch (error) {
        return {
          ok: false,
          message: error,
        }
      }
    }
}
