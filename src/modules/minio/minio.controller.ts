import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MinioService } from './minio.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBookCover(@UploadedFile() file: Express.Multer.File) {
    await this.minioService.createBucketIfNotExists();
    const fileName = await this.minioService.uploadFile(file);
    return fileName;
  }

  @Get(':fileName')
  async getBookCover(@Param('fileName') fileName: string) {
    const fileUrl = await this.minioService.getFileUrl(fileName);
    return fileUrl;
  }

  @Delete(':fileName')
  async deleteBookCover(@Param('fileName') fileName: string) {
    await this.minioService.deleteFile(fileName);
    return fileName;
  }
}
