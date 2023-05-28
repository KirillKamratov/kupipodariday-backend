import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}
  async create(createOfferDto: CreateOfferDto) {
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
