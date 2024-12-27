import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateReviewDto } from 'src/dto/review.dto';
import { BuyerRoleGuard } from 'src/guards/buyer.guard';
import { tokenVerificationGuard } from 'src/guards/verify.guard';
import { SuccessResponse } from 'src/utility/globalResponse';
import { ReviewService } from './review.service';

@Controller('review')
@UseGuards(tokenVerificationGuard)
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @UseGuards(BuyerRoleGuard)
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Res() res: Response,
    @Req() req,
  ) {
    const successResponse = { ...SuccessResponse };
    await this.reviewService.create(createReviewDto, req);
    successResponse.message = 'review added';
    res.status(201).json(successResponse);
  }

  @Get(':leftoverId')
  async find(@Param('leftoverId') leftoverId: string, @Res() res: Response) {
    const successResponse = { ...SuccessResponse };
    const reviews = await this.reviewService.find(leftoverId);
    if (reviews) {
      successResponse.data = reviews;
      res.status(200).json(successResponse);
    }
  }

  @UseGuards(BuyerRoleGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('newReview') newReview: string,
    @Res() res: Response,
  ) {
    const successResponse = { ...SuccessResponse };
    await this.reviewService.update(id, newReview);
    successResponse.message = 'updated';
    return res.status(201).json(successResponse);
  }

  @UseGuards(BuyerRoleGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const successResponse = { ...SuccessResponse };
    await this.reviewService.delete(id);
    successResponse.message = 'deleted';
    return res.status(201).json(successResponse);
  }
}
