import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class UserDetails {
  @Prop({
    ref: 'User',
    unique: true,
    required: true,
  })
  userCredentialId: mongoose.Schema.Types.ObjectId;
  @Prop({
    required: true,
  })
  businessName: string;
  @Prop({ required: true })
  contactNumber: number;
  @Prop({ required: true })
  address: string;
  @Prop({ required: true, type: Object, index: '2dsphere' })
  location: object;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserDetailsSchema = SchemaFactory.createForClass(UserDetails);
