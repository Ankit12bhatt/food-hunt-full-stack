import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus(); // Get the HTTP status code of the exception
    const message = exception.message || 'Internal Server Error'; // Get the error message or default to 'Internal Server Error'
    if (status === HttpStatus.BAD_REQUEST) {
      // Handle validation errors (status code 400) separately
      const errorMessage = exception.getResponse()['message'] || 'Error';
      response.status(status).json({
        success: false,
        message: errorMessage,
      });
    } else {
      // Handle other HTTP exceptions
      response.status(status).json({
        success: false,
        message: message,
      });
    }
  }
}
