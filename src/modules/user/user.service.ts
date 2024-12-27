import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDetails } from 'src/schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserDetails.name)
    private userDetailsModel: Model<UserDetails>,
  ) {}

  async getProfile(req): Promise<object> {
    try {
      const user = await this.userDetailsModel.findOne({
        _id: req.user.userId,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateProfile(req, updateUserDto) {
    try {
      await this.userDetailsModel.updateOne(
        { _id: req.user.userId },
        { $set: updateUserDto },
      );
      return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getNearbyRestaurant(query): Promise<object[]> {
    console.log(query);
    try {
      const user = await this.userDetailsModel.find({
        location: {
          $nearSphere: {
            $geometry: {
              type: 'Points',
              // coordinates: [30.3499504, 78.0650926],
              coordinates: [Number(query.latitude), Number(query.longitude)],
            },
            $maxDistance: 5000, //in meters
            $minDistance: 10,
          },
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // async updateCredentials(req, updateUserDto) {
  //   try {
  //     await this.userModel.updateOne(
  //       { _id: req.user.userId },
  //       { $set: { email: updateUserDto.email } },
  //     );
  //     return true;
  //   } catch (error) {
  //     throw new InternalServerErrorException();
  //   }
  // }
}
