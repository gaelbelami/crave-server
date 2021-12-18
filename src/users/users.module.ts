import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserVerification } from '../verification/entities/user.verification.entity';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';
import { UserResetPassword } from 'src/verification/entities/user.reset.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserVerification, UserResetPassword])],
    providers: [UserResolver, UserService],
    exports: [UserService]
})
export class UsersModule { }
