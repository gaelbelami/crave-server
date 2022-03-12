import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { PUB_SUB, WATCH_MESSAGES } from 'src/shared/constants/common.constants';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateChatInput, CreateChatOutput } from './dtos/create-chat.dto';
import {
  CreateMessageInput,
  CreateMessageOutput,
} from './dtos/create-message.dto';
import { MyChatsInput, MyChatsOutput } from './dtos/my-chats.dto';
import { MyMessagesInput, MyMessagesOutput } from './dtos/my-messages.dto';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async createChat( userId: number, { friendId }: CreateChatInput ): Promise<CreateChatOutput> {

    try {

      const chat = await this.chatRepository.findOne({ where: [{user1: userId, user2: friendId }, {user1: friendId, user2: userId }, ] });

      if (!chat) {

        const user1 = await this.userRepository.findOne(userId)

        const user2 = await this.userRepository.findOne(friendId)

        const newChat = await this.chatRepository.save( this.chatRepository.create({ user1, user2 }));

        return { ok: true, message: 'Chat created successfully', chat: newChat };

      }

      return { ok: true, chat };

    } catch (error) {

      return { ok: false, message: 'Could not create Chat.' };

    }
  }

  async sendMessage( sender: User, { content, chatId }: CreateMessageInput ): Promise<CreateMessageOutput> {

    try {

      const chat = await this.chatRepository.findOne(chatId, { relations: ['user1', 'user2'] });
      
      const message = await this.messageRepository.save( this.messageRepository.create({ content, sender, chat })); 

      let whoToSendMessage: number;

      const { user1, user2 } = chat;

      const senderId = user1.id;          
          
      if (user1.id !== sender.id) {

        whoToSendMessage = user1.id;

      } else {

        whoToSendMessage = user2.id;

      }

      this.pubSub.publish( WATCH_MESSAGES, { watchMessages: { message, senderId, messageReceiver: whoToSendMessage }});

      return { ok: true };

    } catch (error) {

      return { ok: false, message: 'Could not create message' };

    }
  }

  async myMessages( user: User, { chatId, page }: MyMessagesInput ): Promise<MyMessagesOutput> {
    
    try {

      const results = await this.messageRepository.find({
        where: { chat: chatId, sender: user },
        order: { createdAt: 'ASC' },
        relations: ['sender'],
        skip: (page - 1) * 50,
        take: 50,
      });

      if (!results) {
        return { ok: false, message: 'No message found' };
      }

      return { ok: true, results };

    } catch (error) {

      return { ok: false, message: 'No message found' };

    }
  }

  async myChats( user: User, { page }: MyChatsInput ): Promise<MyChatsOutput> {

    try {

      const results = await this.chatRepository.find({
        where: [{ user1:user},{ user2: user }],
        order: { createdAt: 'ASC' },
        relations: ['user1', 'user2'],
        skip: (page - 1) * 9,
        take: 9,
      });

      if (!results) {
        return { ok: false, message: 'No chat found' };
      }

      return { ok: true, results };

    } catch (error) {

      return { ok: false, message: 'No chat found' };

    }
  }
}
