import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PubSub } from "graphql-subscriptions";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { PUB_SUB, WATCH_MESSAGES } from "src/shared/constants/common.constants";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateChatInput, CreateChatOutput } from "./dtos/create-chat.dto";
import { CreateMessageInput, CreateMessageOutput } from "./dtos/create-message.dto";
import { Chat } from "./entities/chat.entity";
import { Message } from "./entities/message.entity";


@Injectable()
export class ChatService {
    constructor(@InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(Restaurant) private readonly restaurantRepository: Repository<Restaurant>,
     @Inject(PUB_SUB) private readonly pubSub: PubSub){}


    async createChat(user: User, {restaurantId}: CreateChatInput): Promise<CreateChatOutput>{
        try {
            const restaurant = await this.restaurantRepository.findOne(restaurantId)
            if(!restaurant) {
                return { ok: false, message: "Could not create chat"}
            }
            const chat = await this.chatRepository.findOne({
                where: {user, restaurant}
            })
            
            if(!chat){
                
                const newChat =  await this.chatRepository.save(this.chatRepository.create({user, restaurant}));
                
                return { ok: true, message: "Chat created successfully", chat: newChat }
            }
            
            return { ok: true, chat }

        } catch (error) {

            return { ok: false, message: "Could not create Chat." }

        }
    }

    async sendMessage(sender: User, {content, chatId}: CreateMessageInput ): Promise<CreateMessageOutput>{
        try {
            const chat = await this.chatRepository.findOne(chatId, { relations: ['user', 'restaurant']});            
            const message = await this.messageRepository.save(this.messageRepository.create({content, sender, chat, }))
            
            let whoToSendMessage: number;
            const { user, restaurant } = chat;
            const senderId = user.id;

            if(user.id !== sender.id){
                whoToSendMessage = user.id
            } else {
                whoToSendMessage = restaurant.ownerId
            }
            this.pubSub.publish(WATCH_MESSAGES, {watchMessages: {message, senderId, messageReceiver: whoToSendMessage} }) 
            
            return { ok: true }
        } catch (error) {
            return { ok: false, message: "Could not create message" }
        }
    }


    
}