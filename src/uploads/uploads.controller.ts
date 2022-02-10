import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as S3 from 'aws-sdk/clients/s3';
import { UploadService } from "./uploads.service";

 @Controller('uploads')
export class UploadController {
    constructor(private readonly uploadService: UploadService){}
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file){
      console.log(file)
       return this.uploadService.uploadImageToCloudinary(file)
    }

   
}