import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  UserDetailsSchema,
  UserSchema,
  User,
  UserDetails,
} from '../../schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserMiddleware } from 'src/middleware/user.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDetails.name, schema: UserDetailsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  //implementation of NestModule required for Middleware use
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('user');
  }
}
