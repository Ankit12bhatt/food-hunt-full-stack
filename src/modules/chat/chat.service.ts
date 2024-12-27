import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/schema/chat.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async create(req, createChatDto) {
    return await this.chatModel.create(createChatDto);
  }

  async get(id) {
    const chats = await this.chatModel.find({ key: id });
    return chats;
  }
}
