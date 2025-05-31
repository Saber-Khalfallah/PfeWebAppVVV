import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();
      
      let message = 'Internal server error';
      let errors = null;
      
      // Handle validation errors specifically
      if (typeof errorResponse === 'object') {
        const errorObj = errorResponse as any;
        message = errorObj.message || message;
        errors = errorObj.errors || null;
      } else if (typeof errorResponse === 'string') {
        message = errorResponse;
      }
  
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
        errors,
      });
    }
  }