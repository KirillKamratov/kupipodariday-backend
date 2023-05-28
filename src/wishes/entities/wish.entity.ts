import { Column, Entity, ManyToOne } from 'typeorm';
import { PrimaryEntity } from '../../utils/primary.entity';
import {
  IsString,
  MaxLength,
  MinLength,
  IsUrl,
  IsNumber,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish extends PrimaryEntity {
  @Column()
  @IsString()
  @MinLength(1, {
    message: 'Минимальная длина поля - 1 символ',
  })
  @MaxLength(250, {
    message: 'Максимальная длина поля - 250 символов',
  })
  name: string;

  @Column()
  @IsString()
  @IsUrl()
  link: string;

  @Column()
  @IsString()
  @IsUrl()
  image: string;

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: User;

  @Column()
  @IsString()
  @MinLength(1, {
    message: 'Минимальная длина поля - 1 символ',
  })
  @MaxLength(1024, {
    message: 'Максимальная длина поля - 1024 символа',
  })
  description: string;

  @ManyToOne(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column()
  copied?: number;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist;
}
