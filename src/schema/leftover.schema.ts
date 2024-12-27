import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Leftover {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails',
    required: true,
  })
  restaurantId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  originalPrice: number;

  @Prop({
    enum: [
      'Starter',
      'Beverage',
      'Dessert',
      'Breakfast',
      'Fastfood',
      'Lunch',
      'Dinner',
    ],
    required: true,
  })
  category: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  reducedPrice: number;

  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ required: true, type: String })
  qrCodeBuffer;

  @Prop({ type: Date, required: true })
  onset: Date;

  @Prop({ type: Date, required: true })
  offset: Date;

  @Prop({ required: true, type: Object, index: '2dsphere' })
  location: object;
}

export const leftoverSchema = SchemaFactory.createForClass(Leftover);
