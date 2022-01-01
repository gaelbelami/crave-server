import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from 'src/users/users.module';
import { AuthAdminGuard } from './auth.admin.guard';
import { AuthUserGuard } from './auth.user.guard';

@Module({
    imports: [UsersModule],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthUserGuard || AuthAdminGuard,
        }
    ]
})
export class AuthModule { }
