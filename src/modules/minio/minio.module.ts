import { Logger, Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioController } from './minio.controller';

@Module({
  imports: [ConfigModule],
  controllers: [MinioController],
  providers: [MinioService, Logger],
  exports: [MinioService],
})
export class MinioModule {}
