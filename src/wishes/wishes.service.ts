import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto) {
    return this.wishRepository.save(createWishDto);
  }

  async findAll(): Promise<Wish[]> {
    return this.wishRepository.find();
  }

  async findOne(id: number): Promise<Wish> {
    return this.wishRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    await this.wishRepository.update(id, updateWishDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const wish = await this.findOne(id);
    await this.wishRepository.delete(id);
    return wish;
  }

  async findWishList(wish): Promise<Wish[]> {
    return await this.wishRepository.findBy(wish);
  }
}
