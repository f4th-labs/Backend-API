import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '3cebaac1-f94e-484c-8afd-a9524fd35ade',
    description: 'User unique identifier',
  })
  id: string;

  @ApiProperty({
    example: 'author1@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'author',
    description: 'User role',
    enum: ['admin', 'author', 'user'],
  })
  role: string;
}
