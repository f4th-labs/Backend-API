import { Controller, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard, RolesGuard } from '@/common/guards';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.usersService.createUser(registerUserDto);
  }

  @Post('author')
  async createAuthor(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.usersService.createAuthor(registerUserDto);
  }

  @Post('admin')
  async createAdmin(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.usersService.createAdmin(registerUserDto);
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

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
