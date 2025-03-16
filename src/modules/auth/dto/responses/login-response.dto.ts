import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    example: 'Successfully logged in',
    description: 'Status message',
  })
  message: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
