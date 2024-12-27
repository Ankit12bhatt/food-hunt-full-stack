import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from 'src/dto/create-product.dto';
import { Response } from 'express';
import { ErrorResponse, SuccessResponse } from 'src/utility/globalResponse';
import { tokenVerificationGuard } from 'src/guards/verify.guard';
import { SellerRoleGuard } from 'src/guards/seller.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('product')
@UseGuards(tokenVerificationGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @UseGuards(SellerRoleGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const randomName = uuidv4(); // Generate UUID
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createProduct(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    console.log(file);
    const successResponse = { ...SuccessResponse };
    const errorResponse = { ...ErrorResponse };
    if (
      await this.productService.createProduct(
        req,
        createProductDto,
        file.filename,
      )
    ) {
      successResponse.message = 'product created !';
      return res.status(201).json(successResponse);
    }
    return res.status(400).json(errorResponse);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const successResponse = { ...SuccessResponse };
    const products = await this.productService.get(id);
    if (products) {
      successResponse.data = products;
      return res.status(200).json(successResponse);
    }
  }
}
