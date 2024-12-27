import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Leftover, leftoverSchema } from 'src/schema/leftover.schema';
import { Order, orderSchema } from 'src/schema/order.schema';
import {
  User,
  UserDetails,
  UserDetailsSchema,
  UserSchema,
} from 'src/schema/user.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Product, productSchema } from 'src/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: orderSchema },
      { name: Leftover.name, schema: leftoverSchema },
      { name: User.name, schema: UserSchema },
      { name: UserDetails.name, schema: UserDetailsSchema },
      { name: Product.name, schema: productSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
