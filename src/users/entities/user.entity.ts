import { PrimaryEntity } from '../../utils/primary.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import {
  IsString,
  MaxLength,
  MinLength,
  IsUrl,
  IsEmail,
} from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class User extends PrimaryEntity {
  @Column({
    unique: true,
  })
  @IsString()
  @MinLength(2, {
    message: 'Минимальная длина поля - 2 символа',
  })
  @MaxLength(30, {
    message: 'Максимальная длинна поля - 30 символов',
  })
  username: string;

  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  @IsString()
  @MinLength(2, {
    message: 'Минимальная длина поля - 2 символа',
  })
  @MaxLength(200, {
    message: 'Максимальная длинна поля - 200 символов',
  })
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsString()
  @IsUrl()
  avatar: string;

  @Column({
    unique: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
}
