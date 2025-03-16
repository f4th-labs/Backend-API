import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User password',
    example: 'password',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;
}
