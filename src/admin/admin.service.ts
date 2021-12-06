import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import {
  CreateAdminAccountInput,
  CreateAdminAccountOutput,
} from './Dtos/create-admin-account.dto';
import { LoginAdminInput, LoginAdminOutput } from './Dtos/login-admin-account.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRespository: Repository<Admin>,
    private readonly jwtService: JwtService,
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

  async loginAdmin({email, password}: LoginAdminInput): Promise<LoginAdminOutput>{
    try {
      const admin = await this.adminRespository.findOne({email});
      if(!admin){
        return {
          ok: false,
          message: 'Admin not found'
        }
      }
      const passwordCorrect = await admin.checkPassword(password);
      if(!passwordCorrect){
        return {
          ok: false,
          message: "Wrong authentication credentials"
        }
      }
      const token = this.jwtService.sign({id: admin.id});

      return {
        ok: true,
        token,        
      }
    } catch (error) {
      return {
        ok:false,
        message: "Something wrong happened"
      }
    }
  }


  async findById(id: number): Promise<Admin>{
    
      return this.adminRespository.findOne({id}) 
     
     
  }
}
