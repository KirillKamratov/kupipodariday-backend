import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}
  async create(createOfferDto: CreateOfferDto, user: User) {
    const id = createOfferDto.itemId;
    const wish = await this.wishesService.findOne(id);
    if (user.id === wish.owner.id) {
      throw new NotFoundException(
        'Вы не можете вносить деньги на собственные подарки',
      );
    }
    if (createOfferDto.amount + wish.raised > wish.price) {
      throw new ForbiddenException(
        'Сумма взноса превышает сумму остатка стоимости подарка',
      );
    }
    return this.offerRepository.save(createOfferDto);
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    await this.offerRepository.update(id, updateOfferDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const offer = await this.findOne(id);
    await this.offerRepository.delete(id);
    return offer;
  }
}
