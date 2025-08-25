import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SavedPlacesService } from './saved-places.service';
import { CurrentAdmin } from 'src/common/decorators/current-user.decorator';
import { AdminJwtAuthGuard } from 'src/auth/admin/admin-jwt.guard';
import { Admin } from 'src/admin/entity/admin.entity';

@UseGuards(AdminJwtAuthGuard)
@Controller('admin/saved-places')
export class SavedPlacesAdminController {
  constructor(private readonly savedService: SavedPlacesService) { }
  @Get('listAll')
  async findAllForAdmin(
    @CurrentAdmin() admin: Admin,
    @Query('userId') userId?: number,
  ) {
    if (!userId) {
      return this.savedService.findAllForAdmin(admin.id);
    }
    return this.savedService.findAllForAdmin(admin.id, userId);
  }
}