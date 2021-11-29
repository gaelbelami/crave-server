import { Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';

@Resolver(of => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}
}
