import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { LeftoversModule } from './modules/leftovers/leftovers.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductModule } from './modules/product/product.module';
import { ReviewModule } from './modules/review/review.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(), //.env configuration
    ScheduleModule.forRoot(), //cron scheduler
    MongooseModule.forRoot(process.env.DB_URL, {
      dbName: 'FoodioDB',
    }),
    UserModule,
    AuthModule,
    ProductModule,
    LeftoversModule,
    OrdersModule,
    ReviewModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
