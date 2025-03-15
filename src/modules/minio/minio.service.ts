import {
  BadRequestException,
  Injectable,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { JwtAuthGuard } from '@/common/guards';

@UseGuards(JwtAuthGuard)
@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint:
        configService.get<string>('MINIO_PUBLIC_ENDPOINT') || 'localhost',
      port: configService.get<number>('MINIO_PORT'),
      useSSL: configService.get<string>('MINIO_USE_SSL') === 'true',
      accessKey: configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: configService.get<string>('MINIO_SECRET_KEY'),
    });
    this.bucketName =
      configService.get<string>('MINIO_BUCKET_NAME') || 'default';
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'ap-southeast-1');
    }
  }

  async uploadFile(file: Express.Multer.File) {
    await this.validateFile(file);
    const fileName = `${Date.now()}-${file.originalname}`;
    try {
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
      );
      return fileName;
    } catch (error) {
      throw new BadRequestException(
        `Failed to upload file to Minio: ${error.message}`,
      );
    }
  }

  async getFileUrl(fileName: string) {
    try {
      const url = await this.minioClient.presignedUrl(
        'GET',
        this.bucketName,
        fileName,
        604800,
      );
      return url;
    } catch (error) {
      throw new BadRequestException(
        `Failed to generate file URL: ${error.message}`,
      );
    }
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }

  async validateFile(file: Express.Multer.File) {
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        'File size exceeds the maximum limit of 5MB',
      );
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG and PNG are allowed',
      );
    }
  }
}
