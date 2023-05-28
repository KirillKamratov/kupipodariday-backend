import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private WishListRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(createWishListDto: CreateWishlistDto, user: User) {
    const wishToAdd = await this.wishesService.findWishList(
      createWishListDto.items,
    );
    await this.WishListRepository.save({
      ...createWishListDto,
      owner: user,
      items: wishToAdd,
    });
  }

  async findAll(): Promise<Wishlist[]> {
    return this.WishListRepository.find();
  }

  async findOne(id: number): Promise<Wishlist> {
    return this.WishListRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(
    id: number,
    number: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishListToUpdate = await this.WishListRepository.findOneBy({ id });
    const wishes = await this.wishesService.findWishList(
      updateWishlistDto.items,
    );
    return await this.WishListRepository.save({
      ...wishListToUpdate,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      description: updateWishlistDto.description,
      items: wishes,
    });
  }

  async remove(id: number) {
    const wishList = await this.findOne(id);
    await this.WishListRepository.delete(id);
    return wishList;
  }
}
