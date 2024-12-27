import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import * as qr from 'qrcode';
import { Leftover } from 'src/schema/leftover.schema';
import { Order } from 'src/schema/order.schema';
import { Product } from 'src/schema/product.schema';
import { UserDetails } from 'src/schema/user.schema';

@Injectable()
export class LeftoversService {
  constructor(
    @InjectModel(Leftover.name) private leftoverModel: Model<Leftover>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(UserDetails.name) private userDetailsModel: Model<UserDetails>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  @Cron('45 * * * * *')
  async updateLeftoverStatus() {
    const leftovers = await this.leftoverModel.find({ status: 'active' });
    if (leftovers.length) {
      await Promise.all(
        leftovers.map(async (leftover) => {
          if (new Date(leftover.offset) <= new Date()) {
            await this.leftoverModel.updateOne(
              { _id: leftover._id },
              { $set: { status: 'inactive' } },
            );
            console.log(leftover._id);
          }
        }),
      );
    }
  }

  async createLeftover(req, createleftoverdto) {
    console.log(createleftoverdto);
    const thresholdTimeObject = new Date(createleftoverdto.onset);
    thresholdTimeObject.setHours(thresholdTimeObject.getHours() + 8);
    const thresholdISOstring = thresholdTimeObject.toISOString();
    if (createleftoverdto.offset >= thresholdISOstring) {
      const qrCodeBuffer = await qr.toDataURL(
        JSON.stringify(createleftoverdto),
      );
      const user = await this.userDetailsModel.findOne({
        _id: req.user.userId,
      });
      const item = { qrCodeBuffer: qrCodeBuffer };
      const item1 = { restaurantId: req.user.userId, location: user.location };
      const obj = { ...createleftoverdto, ...item, ...item1 };
      await this.leftoverModel.create(obj);
      return qrCodeBuffer;
    } else return false;
  }

  //search
  async getLeftover(req, query?) {
    if (req.user.role === 'seller') {
      return await this.leftoverModel.find({ restaurantId: req.user.userId });
    }
    if (query.name !== undefined) {
      const info = await this.productModel.find(
        {
          productName: { $regex: query.name, $options: 'i' },
        },
        { _id: true },
      );
      if (info) {
        const idsArray = [];
        info.forEach((x) => idsArray.push(x._id));
        const data = await this.leftoverModel
          .find(
            {
              $and: [
                // { offset: { $gte: new Date() } },
                { productId: { $in: idsArray } },
              ],
            },
            { qrCodeBuffer: false },
          )
          .populate('productId');
        return data;
      }
      return [];
    } else if (query.latitude & query.longitude) {
      try {
        const leftovers = await this.leftoverModel
          .find(
            {
              location: {
                $nearSphere: {
                  $geometry: {
                    type: 'Points',
                    // coordinates: [30.3499504, 78.0650926],
                    coordinates: [
                      Number(query.latitude),
                      Number(query.longitude),
                    ],
                  },
                  $maxDistance: 5000, //in meters
                  $minDistance: 10,
                },
              },
            },
            { qrCodeBuffer: false },
          )
          .populate('productId');
        return leftovers;
      } catch (error) {
        throw new InternalServerErrorException();
      }
    } else {
      const filteredData = await this.productModel.find(
        {
          $and: [
            {
              restaurantId:
                query.restaurantId !== undefined
                  ? query.restaurantId
                  : { $exists: true },
            },
            {
              type: query.type !== undefined ? query.type : { $exists: true },
            },
            {
              category:
                query.category !== undefined
                  ? query.category
                  : { $exists: true },
            },
          ],
        },
        { _id: true },
      );
      const filteredId = [];
      filteredData.forEach((x) => filteredId.push(String(x._id)));
      const selection = await this.leftoverModel
        .find(
          {
            $and: [
              // { offset: { $gte: new Date() } },
              { productId: { $in: filteredId } },
            ],
          },
          { qrCodeBuffer: false },
        )
        .sort({ reducedPrice: query.sort === 'desc' ? -1 : 1 })
        .populate('productId');
      return selection;
    }
  }

  async deleteLeftovers(id) {
    await this.leftoverModel.deleteOne({ _id: id });
    await this.orderModel.deleteMany({ leftoverId: id });
    return true;
  }

  async updateLeftover(id, updateleftoverdto) {
    let Status = 'inactive';
    if (new Date(updateleftoverdto.offset) > new Date()) {
      console.log('innnnnnnn');
      Status = 'active';
    }
    await this.leftoverModel.updateOne(
      { _id: id },
      { $set: { ...updateleftoverdto, status: Status } },
    );
    return true;
  }
}
