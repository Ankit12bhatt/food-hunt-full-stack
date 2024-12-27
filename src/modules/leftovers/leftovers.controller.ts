import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateLeftoverDto } from 'src/dto/create-leftover.dto';
import { UpdateLeftoverDto } from 'src/dto/update-leftover.dto';
import { SellerRoleGuard } from 'src/guards/seller.guard';
import { tokenVerificationGuard } from 'src/guards/verify.guard';
import { ErrorResponse, SuccessResponse } from 'src/utility/globalResponse';
import { LeftoversService } from './leftovers.service';

@Controller('leftovers')
@UseGuards(tokenVerificationGuard)
export class LeftoversController {
  constructor(private leftoverService: LeftoversService) {}

  @UseGuards(SellerRoleGuard)
  @Post()
  async createLeftOvers(
    @Req() req,
    @Body() createleftoverdto: CreateLeftoverDto,
    @Res() res: Response,
  ) {
    const successResponse = { ...SuccessResponse };
    const errorResponse = { ...ErrorResponse };
    const qrcode = await this.leftoverService.createLeftover(
      req,
      createleftoverdto,
    );
    if (qrcode) {
      successResponse.message = 'leftover created !';
      successResponse.data = qrcode;
      return res.status(201).json(successResponse);
    }
    errorResponse.message = 'pickup window should be greater than 8hrs';
    return res.status(400).json(errorResponse);
  }

  @Get()
  async getLeftover(@Res() res: Response, @Req() req, @Query() query?) {
    const successResponse = { ...SuccessResponse };
    const data = await this.leftoverService.getLeftover(req, query);
    console.log(data);
    if (data) {
      successResponse.data = data;
      return res.status(200).json(successResponse);
    }
  }

  @UseGuards(SellerRoleGuard)
  @Put(':id')
  async updateleftover(
    @Param('id') id,
    @Res() res: Response,
    @Body() updateleftoverdto: UpdateLeftoverDto,
  ) {
    const successResponse = { ...SuccessResponse };
    const data = await this.leftoverService.updateLeftover(
      id,
      updateleftoverdto,
    );
    if (data) {
      successResponse.message = 'updated';
      return res.status(200).json(successResponse);
    }
  }

  @UseGuards(SellerRoleGuard)
  @Delete(':id')
  async deleteLeftover(@Param('id') id, @Res() res: Response) {
    const successResponse = { ...SuccessResponse };
    const result = await this.leftoverService.deleteLeftovers(id);
    if (result) {
      successResponse.message = 'deleted';
      return res.status(200).json(successResponse);
    }
  }
}
