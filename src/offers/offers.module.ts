import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { UsersController } from '../users/users.controller';
import { Offer } from './entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class OffersModule {}
