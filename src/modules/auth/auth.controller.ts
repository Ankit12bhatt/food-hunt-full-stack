import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { ErrorResponse, SuccessResponse } from 'src/utility/globalResponse';
import { AuthService } from './auth.service';
import { UserAuthDto } from '../../dto/auth.dto';

@Controller('auth')
export class AuthController {
  //CONSTRUCTOR
  constructor(private readonly authService: AuthService) {}
  // const authService = new AuthService(); is equivalent to above statement

  //ENDPOINTS
  @Post('register')
  async register(
    @Res() response: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const successResponse = { ...SuccessResponse };
    const errorResponse = { ...ErrorResponse };
    //SERVICE CALL
    const res = await this.authService.register(createUserDto);
    //SEND RESONSE
    if (!res) {
      errorResponse.message = `user already exist`;
      return response.status(HttpStatus.CONFLICT).json(errorResponse);
    }
    successResponse.message = `user created`;
    return response.status(HttpStatus.CREATED).json(successResponse);
  }

  @Post('login')
  async login(@Res() response: Response, @Body() user: UserAuthDto) {
    const successResponse = { ...SuccessResponse };
    const errorResponse = { ...ErrorResponse };
    const User = await this.authService.login(user);
    if (User) {
      successResponse.message = 'login successfull';
      successResponse.data = User;
      return response.status(200).json(successResponse);
    } else {
      errorResponse.message = 'invalid credential';
      return response.status(401).json(errorResponse);
    }
  }
}
