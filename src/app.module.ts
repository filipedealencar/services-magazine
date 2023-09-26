import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { ArticleController } from './article/article.controller';
import { ArticleService } from './article/article.service';
import { SequelizeModule } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { LatestPublications } from '@/article/entities/latestPublications';
import { DraftPosts } from '@/article/entities/draftPosts';
import { PostsModule } from './posts/posts.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DraftsService } from './posts/posts.service';

dotenv.config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      database: process.env.DATABASE,
      host: process.env.HOST_DATABASE,
      port: Number(process.env.PORT_DATABASE),
      username: process.env.USERNAME_DATABASE,
      password: process.env.PASSWORD_DATABASE,
      autoLoadModels: true,
      models: [LatestPublications, DraftPosts],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      path: 'post',
    }),
    PostsModule,
    ArticleModule,
  ],
  controllers: [AppController, ArticleController],
  providers: [AppService, ArticleService, DraftsService],
})
export class AppModule {}
