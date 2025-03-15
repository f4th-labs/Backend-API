import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UnauthorizedException,
  Query,
  Put,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
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
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards';
import { UpdateNewsDto } from './dto/update-news.dto';

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

  @ApiQuery({
    name: 'query',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns news articles matching the search query',
  })
  @Get('search')
  async search(@Query('query') query: string, @Query('q') q: string) {
    const searchTerm = query || q || '';
    return this.newsService.search(searchTerm);
  }

  @Get('posts')
  async findAll() {
    return this.newsService.findAll();
  }

  @Get('post/:id')
  async findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Put('post/:id')
  @Auth(UserRole.AUTHOR, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    const news = await this.newsService.findOne(id);
    const isAdmin = user.role === UserRole.ADMIN;
    const isAuthor = news.author && news.author.id === user.id;

    if (!isAdmin && !isAuthor) {
      throw new UnauthorizedException(
        'You do not have permission to update this post',
      );
    }

    if (file) {
      await this.minioService.createBucketIfNotExists();
      const fileName = await this.minioService.uploadFile(file);
      updateNewsDto.imageUrl = await this.minioService.getFileUrl(fileName);
    }

    const result = await this.newsService.update(id, updateNewsDto);
    return result;
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
