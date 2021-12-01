import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAdminAccountInput,
  CreateAdminAccountOutput,
} from './Dtos/create-admin-account.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRespository: Repository<Admin>,
  ) {}

  async createAdminAccount({
    email,
    password,
  }: CreateAdminAccountInput): Promise<CreateAdminAccountOutput> {
    try {
      const exists = await this.adminRespository.findOne({ email });
      if (exists) {
        return {
          ok: false,
          message: 'There is an account assigned to that email already',
        };
      }

      await this.adminRespository.save(
        this.adminRespository.create({ email, password }),
      );

      return {
        ok: true,
        message: 'Account created successfully',
      };
    } catch (error) {
      return {
        ok: false,
        message: "Couldn't create Admin account",
      };
    }
  }
}
