import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UploadController } from './uploads.controller';
import { UploadService } from './uploads.service';

@Module({
    providers:[UploadController, UploadService],
    imports: [CloudinaryModule],
    controllers:[UploadController]
})
export class UploadsModule {}
