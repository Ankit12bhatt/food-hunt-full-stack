import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Chat {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails',
    required: true,
  })
  key: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({
    enum: ['buyer', 'foodio'],
    required: true,
    default: 'foodio',
  })
  user: string;
}

export const chatSchema = SchemaFactory.createForClass(Chat);
