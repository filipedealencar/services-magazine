import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DraftPosts, LatestPublications } from './article.entity';

@Module({
  imports: [SequelizeModule.forFeature([LatestPublications, DraftPosts])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
