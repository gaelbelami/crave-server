import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from './entities/user.entity';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';

@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers: [UserResolver, UserService],
    exports: [UserService]
})
export class UsersModule {}
