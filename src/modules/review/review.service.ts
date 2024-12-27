import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from 'src/schema/review.schema';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async create(createReviewDto, req) {
    await this.reviewModel.deleteMany({
      $and: [
        { reviewerId: req.user.userId },
        { leftoverId: createReviewDto.leftoverId },
      ],
    });
    await this.reviewModel.create({
      ...createReviewDto,
      reviewerId: req.user.userId,
    });
    return;
  }

  async find(leftoverId) {
    return await this.reviewModel.findOne({ leftoverId: leftoverId });
  }

  async update(id, newReview) {
    await this.reviewModel.updateOne(
      { _id: id },
      {
        $set: { review: newReview },
      },
    );
  }

  async delete(id) {
    await this.reviewModel.deleteOne({ _id: id });
    return;
  }
}
