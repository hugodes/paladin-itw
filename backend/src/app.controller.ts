import { Controller, Get, Post, Patch, Body, Param, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Reason } from './availability/availability.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('availability')
  async addAvailabilitySlot(
    @Body('date') date: string,
    @Body('startTime') startTime: string,
    @Body('endTime') endTime: string,
  ) {
    try {
      return await this.appService.addAvailabilitySlot(new Date(date), startTime, endTime);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('availabilities')
  async getAllAvailabilities(@Headers('Auth') auth: string) {
    if (auth === 'doctor') {
      return this.appService.getAllAvailabilities();
    } else if (auth === 'patient') {
      return this.appService.getAvailableAvailabilities();
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Patch('availability/:id/book')
  async bookAvailabilitySlot(
    @Param('id') id: number,
    @Body('reason') reason: Reason,
    @Body('comment') comment?: string,
  ) {
    try {
      return await this.appService.bookAvailabilitySlot(id, reason, comment);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}