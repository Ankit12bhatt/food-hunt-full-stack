import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { Leftover } from 'src/schema/leftover.schema';
import { Order } from 'src/schema/order.schema';
import { Product } from 'src/schema/product.schema';
import { User, UserDetails } from 'src/schema/user.schema';

@Injectable()
export class OrdersService {
  private transporter: nodemailer.Transporter;
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Leftover.name) private leftoverModel: Model<Leftover>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserDetails.name) private userDetailsModel: Model<UserDetails>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.PASS_EMAIL,
        pass: process.env.PASS_KEY,
      },
    });
  }

  async createOrder(req, dto) {
    const leftover = await this.leftoverModel.findOne({ _id: dto.leftoverId });
    if (new Date() <= new Date(leftover.offset) && dto.quantity) {
      const otherId = {
        restaurantId: leftover.restaurantId,
        buyerId: req.user.userId,
        productId: leftover.productId,
      };
      const orderDetails = { ...dto, ...otherId };
      const order = await this.orderModel.create(orderDetails);
      //managing quantity
      await this.leftoverModel.updateOne(
        { _id: dto.leftoverId },
        { $set: { quantity: leftover.quantity - dto.quantity } },
      );
      //steps below for sending mail
      const UserDetails = await this.userDetailsModel.findOne({
        _id: req.user.userId,
      });
      const email = await this.userModel.findOne({
        _id: UserDetails.userCredentialId,
      });
      await this.sendMail(
        `${email.email}`,
        'order placed for collection code!',
        `${order._id}`,
      );
      return order._id;
    } else return false;
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      // Sending email
      await this.transporter.sendMail({
        to,
        subject,
        text,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async get(id: string, req) {
    if (req.user.role === 'seller') {
      const orders = await this.orderModel
        .find({ restaurantId: id })
        .populate('leftoverId');
      const product = [];
      orders.forEach((order) =>
        product.push(String((order.leftoverId as any).productId)),
      );
      const products = await this.productModel.find({ _id: { $in: product } });
      const data = [];
      products.forEach((product) => {
        orders.forEach((order: any) => {
          if (
            String((order.leftoverId as any).productId) === String(product._id)
          ) {
            const Product = { name: product.productName, Image: product.img };
            const Order = { orderOn: order.createdAt };
            data.push({ ...Product, ...Order });
          }
        });
      });
      return data;
    }
    const orders = await this.orderModel.find({ buyerId: id });
    const leftoversIds = [];
    orders.forEach((order) => leftoversIds.push(order.leftoverId));
    const leftovers = await this.leftoverModel
      .find({
        _id: { $in: leftoversIds },
      })
      .populate('productId');
    return leftovers;
  }
}
