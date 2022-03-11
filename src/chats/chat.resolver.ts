import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth.user.decorator";
import { ChatService } from "./chat.service";
import { Chat } from "./entities/chat.entity";
import {User} from "../users/entities/user.entity"
import { CreateChatInput, CreateChatOutput } from "./dtos/create-chat.dto";
import { CreateMessageInput, CreateMessageOutput } from "./dtos/create-message.dto";
import { Role } from "src/auth/role.decorator";
import { Inject } from "@nestjs/common";
import { PUB_SUB, WATCH_MESSAGES } from "src/shared/constants/common.constants";
import { PubSub } from "graphql-subscriptions";
import { Message } from "./entities/message.entity";
import { MyMessagesInput, MyMessagesOutput } from "./dtos/my-messages.dto";
import { MyChatsInput, MyChatsOutput } from "./dtos/my-chats.dto";
 
@Resolver(of => Chat)
export class ChatResolver {
    constructor(private readonly chatService: ChatService, @Inject(PUB_SUB) private readonly pubSub: PubSub ){}

    @Mutation(returns => CreateChatOutput)
    @Role(['any'])
    async findOrCreateChat( @AuthUser() loggedInUser: User, @Args("createChatInput") createChatInput: CreateChatInput ): Promise<CreateChatOutput>{
       
        return this.chatService.createChat(loggedInUser.id, createChatInput)
    }

    @Mutation(returns => CreateMessageOutput)
    @Role(['any'])
    async sendMessage(@AuthUser() loggedInUser, @Args('createMessageInput') createMessageInput: CreateMessageInput ): Promise<CreateMessageOutput>{
        return this.chatService.sendMessage(loggedInUser, createMessageInput)
    }

    @Subscription(() => CreateMessageOutput,{filter: ({watchMessages: {senderId, messageReceiver, message}},_, {user}) => {
         if(messageReceiver === user.id){
             return message
         }
         return messageReceiver === user.id
    },
    })
    @Role(['any']) 
    async watchMessages() {
    return this.pubSub.asyncIterator(WATCH_MESSAGES)
  }

  @Query(returns => MyChatsOutput)
  @Role(['any']) 
  async myChats(@AuthUser() loggedInUser, @Args('myChatsInput') myChatsInput: MyChatsInput): Promise<MyChatsOutput>{
      return this.chatService.myChats(loggedInUser, myChatsInput)
  }

  @Query(returns => MyMessagesOutput)
  @Role(['any']) 
  async myMessages(@AuthUser() loggedInUser, @Args('myMessagesInput') myMessagesInput: MyMessagesInput): Promise<MyMessagesOutput>{
      return this.chatService.myMessages(loggedInUser, myMessagesInput)
  }


}