import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Chat, Message, Restaurant, User])],
    providers: [ChatService, ChatResolver]
})
export class ChatsModule {}
