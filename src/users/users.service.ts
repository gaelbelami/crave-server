import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserAccountInput,
  CreateUserAccountOutput,
} from './dtos/create-user-account.dto';
import { LoginUserInput, LoginUserOutput } from './dtos/login-user-account.dto';
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
    // Hash the password
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
  }

  async loginUser({ email, password}: LoginUserInput): Promise<LoginUserOutput>{
    // find the user with te email
    // check if the password is correct
    // make a jwt and give it to the user  
    try {
          const user = await this.userRepository.findOne({email})
        if(!user){
            return {
                ok: false,
                message: "User not found",
            }
        }
        const passwordCorrect = await user.checkPassword(password);
        if(!passwordCorrect){
            return {
                ok: false,
                message: "Wrong password",
            }
        }

        return {
            ok: true,
            token: "Am a token"
        }
      } catch (error) {
          return {
              ok: false,
              message: error,
          }
      }
  }
}
