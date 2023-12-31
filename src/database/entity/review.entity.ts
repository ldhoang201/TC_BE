import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Food } from './food.entity';
import { Restaurant } from './restaurant.entity';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'rate', type: 'int' })
  rate: number;

  @Column({ name: 'content', type: 'varchar', length: 256 })
  content: string;

  @Column({ name: 'food_id', type: 'int', nullable: true })
  foodId: number | null;

  @Column({ name: 'restaurant_id', type: 'int', nullable: true })
  restaurantId: number | null;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Food, (food) => food.reviews)
  @JoinColumn({ name: 'food_id' })
  food: Food;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;
}
