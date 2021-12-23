import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { User } from './users/entities/user.entity';
import { Admin } from './admin/entities/admin.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middlewares';
import { AuthModule } from './auth/auth.module';
import { UserVerification } from './verification/entities/user.verification.entity';
import { MailModule } from './mail/mail.module';
import { UserResetPassword } from './verification/entities/user.reset.entity';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { Category } from './category/entities/category.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { CategoryModule } from './category/category.module';
import { DishesModule } from './dishes/dishes.module';
import { Dish } from './dishes/entities/dish.entity';

@Module({
  imports: [
    // Allows the configs to be available through out the app
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
      }),
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Admin, Restaurant, Category, Dish, UserVerification, UserResetPassword],
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: process.env.NODE_ENV !== 'prod',
    }),

    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ admin: req['admin'] } && { user: req['user'] }),
    }),

    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),

    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      emailDomain: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),

    AuthModule,

    UsersModule,

    AdminModule,

    RestaurantsModule,

    CategoryModule,

    DishesModule,



  ],
  controllers: [],
  providers: [],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.ALL,
    });
  }
}
