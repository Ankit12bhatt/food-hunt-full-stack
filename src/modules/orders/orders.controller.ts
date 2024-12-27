import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { tokenVerificationGuard } from 'src/guards/verify.guard';
import { ErrorResponse, SuccessResponse } from 'src/utility/globalResponse';
import { OrdersService } from './orders.service';

@Controller('order')
@UseGuards(tokenVerificationGuard)
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Post()
  async createOrder(@Req() req, @Body() dto, @Res() res: Response) {
    const successResponse = { ...SuccessResponse };
    const errorResponse = { ...ErrorResponse };
    const orderId = await this.orderService.createOrder(req, dto);
    if (orderId) {
      successResponse.message = 'order placed';
      successResponse.data = orderId;
      return res.status(201).json(successResponse);
    } else {
      errorResponse.message = 'item expired';
      return res.status(301).json(errorResponse);
    }
  }

  @Get(':id')
  async get(@Param('id') id: string, @Req() req, @Res() res: Response) {
    const successResponse = { ...SuccessResponse };
    const orders = await this.orderService.get(id, req);
    if (orders) {
      successResponse.data = orders;
      return res.status(200).json(successResponse);
    }
  }
}
