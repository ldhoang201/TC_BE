import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Review } from './review.entity';
import { Restaurant } from './restaurant.entity';
import { EStatus } from 'src/core/enum/default.enum';

@Entity('food')
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'photo_url', type: 'varchar', length: 256, nullable: true })
  photoUrl: string;

  @Column({ name: 'price', type: 'int' })
  price: number;

  @Column({ name: 'restaurant_id', type: 'int' })
  restaurantId: number;

  @Column({ name: 'is_draft', type: 'boolean' })
  isDraft: boolean;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 100,
    default: EStatus.INACTIVE,
  })
  status: EStatus;

  @Column({ name: 'is_food', type: 'boolean' })
  isFood: boolean;

  @Column({ name: 'description', type: 'varchar', length: 256, nullable: true })
  description: string;

  @OneToMany(() => Review, (review) => review.food)
  reviews: Review[];

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.foods)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;
}
