import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserAccountInput,
  CreateUserAccountOutput,
} from './dtos/create-user-account.dto';
import { LoginUserInput, LoginUserOutput } from './dtos/login-user-account.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import {
  EditUserProfileInput,
  EditUserProfileOutput,
} from './dtos/edit-user-profile.dto';
import { UserVerification } from '../verification/entities/user.verification.entity';
import { VerifyEmailOutput } from 'src/verification/dtos/user.verification.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { MailService } from 'src/mail/mail.service';
import { DeleteUserAccountOutput } from './dtos/delete-user-account.dto';
import { ForgotUserPasswordInput, ForgotUserPasswordOutput } from './dtos/forgot-user-password.dto';
import { UserResetPassword } from 'src/verification/entities/user.reset.entity';
import { ResetPasswordUserInput, ResetPasswordUserOutput } from './dtos/reset-user-password.dto';
import { ChangePasswordUserInput, ChangePasswordUserOutput } from './dtos/change-password-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserVerification)
    private readonly userVerificationRepository: Repository<UserVerification>,
    @InjectRepository(UserResetPassword)
    private readonly userResetPasswordRepository: Repository<UserResetPassword>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }


  //********************************************CREATE ACCOUNT SERVICE********************************************//
  //**************************************************************************************************************//


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
        return { ok: false, message: 'There is a user with that email already' };
      }

      const user = await this.userRepository.save(
        this.userRepository.create({
          firstName,
          lastName,
          email,
          password,
          role,
        }),
      );

      const verification = await this.userVerificationRepository.save(
        this.userVerificationRepository.create({ user }),
      );

      this.mailService.sendVerificationEmail(
        user.firstName,
        user.email,
        verification.code,
      );

      return { ok: true, message: 'Account created successfully' };

    } catch (error) {

      return { ok: false, message: "Couldn't create account." };

    }
  }


  //************************************************LOGIN SERVICE*************************************************//
  //**************************************************************************************************************//


  async loginUser({
    email,
    password,
  }: LoginUserInput): Promise<LoginUserOutput> {
    // find the user with te email
    // check if the password is correct
    // make a jwt and give it to the user
    try {

      const user = await this.userRepository.findOne(
        { email },
        { select: ['id', 'password'] },
      );

      if (!user) {
        return { ok: false, message: 'Invalid email or wrong password' };
      }

      const passwordCorrect = await user.checkPassword(password);

      if (!passwordCorrect) {
        return {
          ok: false, message: 'Invalid email or wrong password'
        };

      }

      const token = this.jwtService.sign({ id: user.id });

      if (!token) {
        return { ok: false, message: 'Please try again later!' };
      }

      return { ok: true, token };

    } catch (error) {

      return { ok: false, message: error };

    }
  }

  //************************************************FIND USER BY ID SERVICE****************************************//
  //**************************************************************************************************************//


  async findUserById(id: number): Promise<UserProfileOutput> {

    try {

      const user = await this.userRepository.findOne({ id });

      return { user, ok: true };

    } catch (error) {

      return { ok: false, message: 'User not found' };

    }
  }

  //***********************************************EDIT PROFILE SERVICE********************************************//
  //**************************************************************************************************************//


  async editUserProfile(
    userId: number,
    {
      firstName,
      lastName,
      email,
      password,
      username,
      phoneNumber,
      address,
      birthdate,
      avatar
    }: EditUserProfileInput,
  ): Promise<EditUserProfileOutput> {
    try {

      const user = await this.userRepository.findOne(userId);

      if (firstName) {
        user.firstName = firstName;
      }

      if (lastName) {
        user.lastName = lastName;
      }

      if(email && email === user.email) {
        return { ok: false, message: "New Email have to be different to the old one"}
      }
      
      
      if (email && email !== user.email) {

        user.email = email;

        user.verified = false;

        const verification = await this.userVerificationRepository.save(
          this.userVerificationRepository.create({ user }),
        );

        this.mailService.sendVerificationEmail(
          user.firstName,
          user.email,
          verification.code,
        );

      }

      if (password) {
        user.password = password;
      }

      if (username) {
        user.username = username;
      }

      if (address) {
        user.address = address;
      }

      if (birthdate) {
        user.birthdate = birthdate;
      }

      if (phoneNumber) {
        user.phoneNumber = phoneNumber;
      }

      if (avatar) {
        user.avatar = avatar;
      }

      await this.userRepository.save(user);

      return { ok: true, message: 'Updated profile successfully' };

    } catch (error) {

      return { ok: false, message: 'Could not update profile' };

    }
  }

  //*********************************************VERIFY EMAIL SERVICE**********************************************//
  //**************************************************************************************************************//


  async verifyEmailUser(code: string): Promise<VerifyEmailOutput> {

    try {

      const verification = await this.userVerificationRepository.findOne(
        { code },
        { relations: ['user'] },
      );

      if (verification) {

        verification.user.verified = true;

        await this.userRepository.save(verification.user);

        await this.userVerificationRepository.delete(verification.id);

        return { ok: true, message: 'Email verified Successfully!' };
      }

      return { ok: false, message: 'This link is no longer valid' };

    } catch (error) {

      return { ok: false, message: error };

    }

  }


  //*********************************************DELETE USER ACCOUNT SERVICE**********************************************//
  //**************************************************************************************************************//


  async deleteUserAccount(id: number): Promise<DeleteUserAccountOutput> {

    try {

      const user = await this.userRepository.findOne(id);

      if (!user) {

        return { ok: false, message: 'No User Found' }
      }

      await this.userRepository.remove(user)

      return { ok: true, message: 'User Account deleted successfully' }

    } catch (error) {

      return { ok: false, message: "Couldn't delete the account" }

    }
  }


  //*********************************************FORGOT PASSWORD USER SERVICE**********************************************//
  //**************************************************************************************************************//


  async forgotPasswordUser({ email }: ForgotUserPasswordInput): Promise<ForgotUserPasswordOutput> {
    try {
      const user = await this.userRepository.findOne({ email });

      if (!user) {
        return { ok: false, message: "The email given doesn't correspond to any of our users." }
      }

      if (email) {
        user.email = email;
      }

      const verification = await this.userResetPasswordRepository.save(
        this.userResetPasswordRepository.create({ user }),
      );

      this.mailService.sendForgotPasswordEmail(
        user.firstName,
        user.email,
        verification.code,
      );


      return { ok: true, message: 'An email has been sent to your email. Please check out your inbox in order to reset your password' };

    } catch (error) {

      return { ok: false, message: "Please check out your email." }

    }
  }


  //*********************************************RESET PASSWORD USER SERVICE**********************************************//
  //**************************************************************************************************************//


  async resetPasswordUser({ password, confirmPassword, code }: ResetPasswordUserInput): Promise<ResetPasswordUserOutput> {

    try {

      if (password !== confirmPassword) {

        return { ok: false, message: 'Passwords do not match' }

      }

      const verification = await this.userResetPasswordRepository.findOne({ code },
        { relations: ['user'] })

      const user = verification.user;

      if (!user) {
        return { ok: false, message: "User not found" }
      }

      if (password) {
        user.password = password;
      }

      await this.userRepository.save(user);

      await this.userResetPasswordRepository.delete(verification.id);

      this.mailService.sendResetPasswordEmail(
        user.firstName,
        user.email
      );

      return { ok: true, message: "Password updated successfully" }


    } catch (error) {

      return { ok: false, message: "Couldn't reset password" }

    }

  }

  //*********************************************CHANGE PASSWORD USER SERVICE**********************************************//
  //**************************************************************************************************************//

  async changePasswordUser(userId: number, {oldPassword, password, confirmPassword}: ChangePasswordUserInput): Promise<ChangePasswordUserOutput> {
    try { 


      const existingPassword = await this.userRepository.findOne(userId,  { select: ['password'] });
      
      const passwordCorrect = await existingPassword.checkPassword(oldPassword);

      if(!passwordCorrect){
        return { ok: false, message: "Old password incorrect"}
      }
      
      if(password === oldPassword) {
        return { ok: false, message: "New password has to be different to the old one"}
      }

      if( password !== confirmPassword){
        return { ok: false, message: "Passwords do not match"}
      }

      const user = await this.userRepository.findOne(userId);


      if(!user) {
        return { ok: false, message: "User not found"} 
      }
      
      
      console.log(user)
      
      
      if(password){
        user.password = password;
      }
      
      await this.userRepository.save(user);

      await this.mailService.sendResetPasswordEmail(user.firstName, user.email);

      return { ok: true, message: "Password updated successfully!"}


    } catch (error) {
      return { ok: false, message: "Could not change password"}
    }
  }

}
