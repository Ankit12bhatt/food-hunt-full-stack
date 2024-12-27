import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { tokenVerificationGuard } from 'src/guards/verify.guard';
import { ErrorResponse, SuccessResponse } from 'src/utility/globalResponse';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(tokenVerificationGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@Request() req, @Res() res: Response) {
    const successResponse = { ...SuccessResponse };
    const errorResponse = { ...ErrorResponse };
    const user = await this.userService.getProfile(req);
    if (user) {
      successResponse.data = user;
      return res.status(HttpStatus.OK).json(successResponse);
    }
    errorResponse.message = 'not found';
    return res.status(404).json(errorResponse);
  }

  // @UseGuards(tokenVerificationGuard)
  @Put()
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const successResponse = { ...SuccessResponse };
    const errorResponse = { ...ErrorResponse };
    if (await this.userService.updateProfile(req, updateUserDto)) {
      successResponse.message = 'profile details updated';
      return res.status(HttpStatus.OK).json(successResponse);
    }
    return res.status(400).json(errorResponse);
  }

  @Get('nearby')
  async getNearbyRestaurant(@Query() query, @Res() res) {
    const successResponse = { ...SuccessResponse };
    const user = await this.userService.getNearbyRestaurant(query);
    successResponse.data = user;
    return res.status(HttpStatus.OK).json(successResponse);
  }

  // @Put()
  // async updateCredentials(
  //   @Request() req,
  //   @Body() updateUserDto: UpdateUserDto,
  //   @Res() res: Response,
  // ) {
  //   if (await this.userService.updateCredentials(req, updateUserDto))
  //     return res.status(HttpStatus.OK).json(successResponse);
  //   return res.status(500).json(errorResponse);
  // }
}
