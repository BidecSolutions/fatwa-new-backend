import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedPlace } from './entity/saved-place.entity';
import { SavedPlacesService } from './saved-places.service';
import { SavedPlacesController } from './saved-places.controller';
import { User } from 'src/users/entity/user.entity';
import { SavedPlacesAdminController } from './saved-places-admin.controller';
import { Admin } from 'src/admin/entity/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavedPlace, User, Admin])],
  providers: [SavedPlacesService],
  controllers: [SavedPlacesController, SavedPlacesAdminController],
})
export class SavedPlacesModule {}
