import { Column, Entity, ManyToOne } from 'typeorm';
import { PrimaryEntity } from '../../utils/primary.entity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsBoolean, IsNumber } from 'class-validator';

@Entity()
export class Offer extends PrimaryEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @Column({
    default: false,
  })
  @IsBoolean()
  hidden: boolean;
}
