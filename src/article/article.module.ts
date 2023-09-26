import { Module } from '@nestjs/common';
import { ArticleController } from '@/article/article.controller';
import { ArticleService } from '@/article/article.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LatestPublications } from '@/article/entities/latestPublications';
import { DraftPosts } from '@/article/entities/draftPosts';

@Module({
  imports: [SequelizeModule.forFeature([LatestPublications, DraftPosts])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
