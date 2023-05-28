import { PrimaryEntity } from '../../utils/primary.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsString, MaxLength, MinLength, IsUrl } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wishlist extends PrimaryEntity {
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
  @MaxLength(1500, {
    message: 'Максимальная длина поля - 1500 символов',
  })
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @OneToMany(() => Wish, (wish) => wish.wishlist)
  items: Wish[];

  @ManyToOne(() => User, (owner) => owner.wishlists)
  owner: User;
}
