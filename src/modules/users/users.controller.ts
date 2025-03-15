import { Controller, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get, Post, Put, Delete, Param, Body, Request } from '@nestjs/common';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.usersService.createUser(registerUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user) {
    return this.usersService.findUserbyEmail(user.email);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findUserByid(id);
  }

  @Put(':id')
  async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
