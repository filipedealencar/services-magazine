import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { ArticleModule } from './article/article.module';
import { ArticleController } from './article/article.controller';
import { ArticleService } from './article/article.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DraftPosts, LatestPublications } from './article/article.entity';
import * as dotenv from 'dotenv';

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
    PostsModule,
    ArticleModule,
  ],
  controllers: [AppController, ArticleController],
  providers: [AppService, ArticleService],
})
export class AppModule {}
