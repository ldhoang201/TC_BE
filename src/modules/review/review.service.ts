import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/database/entity/review.entity';
import { Repository } from 'typeorm';
import { V1GetReviewsByUserIdParamDto } from './dto/get-reviews-by-user-id.dto';
import { UserService } from '../user/user.service';
import { V1PostReviewBodyDto } from './dto/post-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    // eslint-disable-next-line no-unused-vars
    private userService: UserService,
  ) {}

  private roundUpRating(rating) {
    const integerPart = Math.floor(rating);
    const decimalPart = parseFloat((rating % 1).toFixed(2));
    if (decimalPart < 0.25) {
      return integerPart;
    } else if (decimalPart < 0.75) {
      return integerPart + 0.5;
    } else {
      return integerPart + 1;
    }
  }

  async getReviewsByRestaurantId(param): Promise<any> {
    const { restaurantId } = param;

    const reviewRaw = await this.reviewRepository.find({
      where: { restaurantId: restaurantId },
    });
    reviewRaw.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    const ratingSum = reviewRaw.reduce((acc, cur) => {
      return acc + cur.rate;
    }, 0);

    if (reviewRaw.length === 0) {
      return {
        rating: 0,
        reviews: [],
      };
    }

    const reviews = await Promise.all(
      reviewRaw.map(async (review) => {
        const user = await this.userService.getUserById(review.userId);
        return {
          ...review,
          userName: user.name,
          userAvatar: user.avatar,
        };
      }),
    );
    const rating = this.roundUpRating(ratingSum / reviewRaw.length);

    const result = {
      rating,
      reviews: reviews,
    };
    return result;
  }

  async getReviewsByFoodId(param): Promise<any> {
    const { foodId } = param;
    const reviewRaw = await this.reviewRepository.find({
      where: { foodId: foodId },
    });
    reviewRaw.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    const ratingSum = reviewRaw.reduce((acc, cur) => {
      return acc + cur.rate;
    }, 0);

    if (reviewRaw.length === 0) {
      return {
        rating: 0,
        reviews: [],
      };
    }
    const rating = this.roundUpRating(ratingSum / reviewRaw.length);
    const reviews = await Promise.all(
      reviewRaw.map(async (review) => {
        const user = await this.userService.getUserById(review.userId);
        return {
          ...review,
          userName: user.name,
          userAvatar: user.avatar,
        };
      }),
    );
    const result = {
      rating,
      reviews: reviews,
    };
    return result;
  }

  async getReviewsByUserId(param: V1GetReviewsByUserIdParamDto): Promise<any> {
    const { userId } = param;
    const id = parseInt(userId, 10);

    const user = await this.userService.getUserById(id);
    if (!user) {
      return { user: {}, review: [] };
    }
    const reviewsRaw = await this.reviewRepository.find({
      where: { userId: id },
    });
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
    const result = {
      user: userData,
      review: reviewsRaw,
    };
    return result;
  }

  async createRestaurantReview(
    body: V1PostReviewBodyDto,
    param,
    req,
  ): Promise<any> {
    const { rate, content } = body;
    const { restaurantId } = param;
    const userId = req.user.id;
    const user = await this.userService.getUserById(userId);
    const newRestaurantReview = this.reviewRepository.save({
      rate,
      content,
      restaurantId,
      userId,
      userAvatar: user.avatar,
      userName: user.name,
    });
    return newRestaurantReview;
  }

  async createFoodReview(body: V1PostReviewBodyDto, param, req): Promise<any> {
    const { rate, content } = body;
    const { foodId } = param;
    const userId = req.user.id;
    const user = await this.userService.getUserById(userId);
    const newRestaurantReview = this.reviewRepository.save({
      rate,
      content,
      foodId,
      userId,
      userAvatar: user.avatar,
      userName: user.name,
    });
    return newRestaurantReview;
  }
}
