import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Order {
  @Prop({
    ref: 'Leftover',
    required: true,
  })
  leftoverId: mongoose.Schema.Types.ObjectId;

  @Prop({
    ref: 'UserDetails',
    required: true,
  })
  restaurantId: mongoose.Schema.Types.ObjectId;

  @Prop({
    ref: 'UserDetails',
    required: true,
  })
  buyerId: mongoose.Schema.Types.ObjectId;

  @Prop({
    ref: 'Product',
    required: true,
  })
  productId: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
  })
  quantity: number;

  @Prop({
    enum: ['inprocess', 'delivered', 'canceled'],
    required: true,
    default: 'inprocess',
  })
  status: string;
}

export const orderSchema = SchemaFactory.createForClass(Order);
