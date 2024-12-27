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
import { SuccessResponse } from 'src/utility/globalResponse';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(tokenVerificationGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  async create(@Req() req, @Body() createChatDto, @Res() res: Response) {
    const successResponse = { ...SuccessResponse };
    await this.chatService.create(req, createChatDto);
    successResponse.message = 'msg sent';
    return res.status(201).json(successResponse);
  }

  @Get(':id')
  async get(@Param('id') id, @Res() res: Response) {
    const successResponse = { ...SuccessResponse };
    const chats = await this.chatService.get(id);
    successResponse.data = chats;
    return res.status(201).json(successResponse);
  }
}
