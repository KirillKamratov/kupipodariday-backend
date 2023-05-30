import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = this.wishRepository.create({ ...createWishDto, owner });
    return this.wishRepository.save(wish);
  }

  async findAll(): Promise<Wish[]> {
    return this.wishRepository.find();
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
    if (!wish) {
      throw new NotFoundException('Такого подарка нет!');
    }
    return wish;
  }

  async update(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new NotFoundException('Такого подарка нет!');
    }
    if (userId !== wish.owner.id)
      throw new ForbiddenException(
        'Недостаточно прав для редактирования подарка!',
      );
    if (wish.copied > 0) {
      let wishExists;
      const isCopied = await this.wishRepository.find({
        where: { owner: { id: userId } },
      });
      isCopied.length > 0 ? (wishExists = true) : (wishExists = false);
      if (wishExists) {
        throw new ForbiddenException('Подарок уже скопирован!');
      }
    }
    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }
    return await this.wishRepository.update(id, {
      ...updateWishDto,
    });
  }

  async remove(id: number, userId: number) {
    const wish = await this.wishRepository.findOneBy({
      id: id,
    });
    if (!wish) {
      throw new NotFoundException('Такого подарка нет!');
    }
    if (userId !== wish.owner.id)
      throw new ForbiddenException('Вы не можете удалять чужие подарки!');
    return await this.wishRepository.delete(id);
  }

  async findWishList(wish): Promise<Wish[]> {
    return await this.wishRepository.findBy(wish);
  }

  async findLastForty(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  async findFirstTen(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 10,
      order: { createdAt: 'DESC' },
    });
  }

  async copyWish(id: number, user: User) {
    const wish = await this.findOne(id);
    console.dir(wish);
    if (!wish) {
      throw new NotFoundException('Такого подарка нет!');
    }
    if (user.id === wish.owner.id)
      throw new ForbiddenException('Копировать свои подарки нельзя!');
    const { copied } = wish;
    await this.wishRepository.update(id, {
      copied: copied + 1,
    });
    await this.create(user, {
      ...wish,
    });
  }
}
