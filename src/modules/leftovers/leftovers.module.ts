import { Module } from '@nestjs/common';
import { LeftoversController } from './leftovers.controller';
import { LeftoversService } from './leftovers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Leftover, leftoverSchema } from 'src/schema/leftover.schema';
import { Product, productSchema } from 'src/schema/product.schema';
import { UserDetails, UserDetailsSchema } from 'src/schema/user.schema';
import { Order, orderSchema } from 'src/schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Leftover.name, schema: leftoverSchema },
      { name: Product.name, schema: productSchema },
      { name: UserDetails.name, schema: UserDetailsSchema },
      { name: Order.name, schema: orderSchema },
    ]),
  ],
  controllers: [LeftoversController],
  providers: [LeftoversService],
})
export class LeftoversModule {}
