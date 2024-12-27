import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Review {
  @Prop({
    ref: 'Leftover',
    required: true,
  })
  leftoverId: mongoose.Schema.Types.ObjectId;

  @Prop({
    ref: 'UserDetails',
    required: true,
  })
  reviewerId: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
  })
  review: string;

  @Prop({
    required: true,
  })
  star: number;
}

export const reviewSchema = SchemaFactory.createForClass(Review);
