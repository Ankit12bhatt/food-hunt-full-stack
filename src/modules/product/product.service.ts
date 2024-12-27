import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/schema/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createProduct(req, createProductDto, file) {
    const item = { restaurantId: req.user.userId };
    const img = { img: file };
    const obj = { ...createProductDto, ...item, ...img };
    await this.productModel.create(obj);
    return true;
  }

  async get(id: string) {
    return await this.productModel.find({ restaurantId: id });
  }
}
