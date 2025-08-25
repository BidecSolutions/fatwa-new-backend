import { Module } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserJwtStrategy } from './user-jwt.strategy';
import { Role } from 'src/roles/entity/roles.entity';
import { UserRole } from 'src/assig-roles-user/entity/user-role.entity';
import { City } from 'src/city/entity/city.entity';
import { UserDetails } from 'src/users/entity/user_details.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole, City, UserDetails]), // ✅ THIS LINE IS REQUIRED
    JwtModule.register({
      secret: 'user-secret-key',
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService, UserJwtStrategy],
  exports: [UserAuthService],
})
export class UserAuthModule { }
