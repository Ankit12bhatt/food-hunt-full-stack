import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop({
    ref: 'User',
    required: true,
  })
  restaurantId: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
  })
  productName: string;

  @Prop({
    type: String,
    required: true,
  })
  img: string;

  @Prop({
    enum: ['Veg', 'Non Veg'],
    required: true,
  })
  type: string;

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
  price: number;

  @Prop({ required: true })
  ingredients: string;
}

export const productSchema = SchemaFactory.createForClass(Product);
