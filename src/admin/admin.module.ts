import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Admin])],
    providers: [AdminResolver, AdminService]
})
export class AdminModule {}
