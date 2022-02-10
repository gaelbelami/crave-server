import { Module } from '@nestjs/common';
import { Cloudinary } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [Cloudinary, CloudinaryService],
  exports: [Cloudinary, CloudinaryService],
})
export class CloudinaryModule {}