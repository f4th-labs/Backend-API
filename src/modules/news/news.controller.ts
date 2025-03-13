import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../users/users.service';
import { MinioService } from '../minio/minio.service';
import { RolesGuard } from '@/common/guards/roles.guard';
import { UserRole } from '@/shares/enums/user-role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Auth } from '@/common/decorators/auth.decorator';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly usersService: UsersService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @Auth(UserRole.AUTHOR, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    const author = await this.usersService.findUserbyEmail(user.email);
    return this.newsService.create(createNewsDto, author, file);
  }

  @Get('posts')
  async findAll() {
    return this.newsService.findAll();
  }

  @Get('post/:id')
  async findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @Auth(UserRole.AUTHOR, UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateNewsDto: any,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    const news = await this.newsService.findOne(id);
    const isAdmin = user.role === 'admin';
    const isAuthor = news.author && news.author.id === user.id;

    if (!isAdmin && !isAuthor) {
      throw new UnauthorizedException(
        'You do not have permission to update this post',
      );
    }

    if (file) {
      await this.minioService.createBucketIfNotExists();
      const fileName = await this.minioService.uploadFile(file);
      const imageUrl = await this.minioService.getFileUrl(fileName);
      updateNewsDto.imageUrl = imageUrl;
    }

    return this.newsService.update(id, updateNewsDto);
  }

  @Delete('post/:id')
  @Roles(UserRole.AUTHOR, UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    const news = await this.newsService.findOne(id);
    const isAdmin = user.role === 'admin';
    const isAuthor = news.author && news.author.id === user.id;

    if (!isAdmin && !isAuthor) {
      throw new UnauthorizedException(
        'You do not have permission to delete this post',
      );
    }

    return this.newsService.remove(id);
  }
}
