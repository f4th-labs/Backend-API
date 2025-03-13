import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({
    example: 'Successfully logged out',
    description: 'Status message'
  })
  message: string;
}