import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos/users.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/utils/multer.config';
import { UserDetailsDto } from './dtos/user_details.dto';
import { User } from './entity/user.entity';
import { Request } from 'express';
import { UserJwtAuthGuard } from 'src/auth/user/user-jwt.guard';
import { AdminJwtAuthGuard } from 'src/auth/admin/admin-jwt.guard';

@Controller('admin/users')
@UseGuards(AdminJwtAuthGuard)
export class UsersController {
  constructor(private userService: UsersService) { }

  @Post('store')
  @UseInterceptors(FileInterceptor('image', multerConfig('uploads')))
  Store(
    @Body() user: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const image = file?.filename;
    return this.userService.storeUser({ ...user, image });
  }

  @Get('index')
  idnex() {
    return this.userService.idnex();
  }

  @Get('findOne/:id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.userService.findOne(id);
  }

  @Post('findOnebyEmail')
  findOneByEmail(@Body() data: any) {
    console.log(data.email);
    return this.userService.findOnByEmail(data.email);
  }

  @HttpCode(200)
  @Post('update/:id')
  @UseInterceptors(FileInterceptor('image', multerConfig('uploads')))
  update(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const image = file?.filename;
    return this.userService.updateUser(id, { ...user, image });
  }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.userService.statusUpdate(id);
  }

  // crud of user details
  @Post('detailsCreate')
  @UseGuards(UserJwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'identity_card_front', maxCount: 1 },
    { name: 'identity_card_back', maxCount: 1 },
  ], multerConfig('uploads')))
  userDetailsStore(
    @Body() data: UserDetailsDto,
    @UploadedFiles() files: { identity_card_front?: Express.Multer.File[], identity_card_back?: Express.Multer.File[] },
    @Req() req: Request,
  ) {
    const identity_card_front_url = files.identity_card_front?.[0]?.path;
    const identity_card_back_url = files.identity_card_back?.[0]?.path;
    if (identity_card_front_url) {
      data.identity_card_front_url = identity_card_front_url;
    }
    if (identity_card_back_url) {
      data.identity_card_back_url = identity_card_back_url;
    }
    return this.userService.create_user_details(data, req.user as User);
  }
}
