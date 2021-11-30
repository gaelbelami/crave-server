import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserAccountInput,
  CreateUserAccountOutput,
} from './dtos/create-user-account.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUserAccount({
    firstName,
    lastName,
    email,
    password,
    role,
  }: CreateUserAccountInput): Promise<CreateUserAccountOutput> {
    // Check new user
    try {
      const exists = await this.userRepository.findOne({ email });
      if (exists) {
        return {
          ok: false,
          message: 'There is a user with that email already',
        };
      }
      await this.userRepository.save(
        this.userRepository.create({
          firstName,
          lastName,
          email,
          password,
          role,
        }),
      );
      return {
        ok: false,
        message: 'User created successfully',
      };
    } catch (error) {
      return {
        ok: false,
        message: "Couldn't create user.",
      };
    }
    // Create user &  hash password
  }
}
