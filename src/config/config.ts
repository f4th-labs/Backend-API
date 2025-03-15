import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  NODE_ENV: string;

  @IsNotEmpty()
  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  POSTGRES_HOST: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_USER: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_PASSWORD: string;
  
  @IsNotEmpty()
  @IsString()
  POSTGRES_DB: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_EXPIRES_IN: string;

  @IsNotEmpty()
  @IsString()
  MINIO_ACCESS_KEY: string;

  @IsNotEmpty()
  @IsString()
  MINIO_SECRET_KEY: string;

  @IsNotEmpty()
  @IsString()
  MINIO_ENDPOINT: string;

  @IsNotEmpty()
  @IsString()
  MINIO_BUCKET_NAME: string;

  @IsNotEmpty()
  @IsNumber()
  MINIO_PORT: number;

  @IsNotEmpty()
  @IsString()
  ALLOWED_ORIGIN: string;

  @IsNotEmpty()
  @IsString()
  MINIO_USE_SSL: string;

  @IsNotEmpty()
  @IsString()
  MINIO_PUBLIC_ENDPOINT: string;

  get isDevelopment(): boolean {
    return this.NODE_ENV === 'development';
  }
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}