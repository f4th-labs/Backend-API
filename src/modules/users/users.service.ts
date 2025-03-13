import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserByid(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findUserbyEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async createUser(registerUserDto: RegisterUserDto): Promise<User> {
    await this.isUserExist(registerUserDto.email);

    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...registerUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UpdateUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update({ id: id }, updateUserDto);
    await this.userRepository.save(user);

    return user;
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }

    await this.userRepository.delete(id);

    await this.userRepository.save(user);

    return user;
  }

  private async isUserExist(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new ConflictException('User with this email already exists');
    }
  }
}
