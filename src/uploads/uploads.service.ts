
import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CLOUDINARY } from 'src/shared/constants/common.constants';

@Injectable()
export class UploadService {
  constructor(private cloudinary: CloudinaryService) {}

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }
};