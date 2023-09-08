import { Controller, Get, Param } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async checkForNewPublications() {
    return await this.articleService.checkForNewPublicationsForAllSites();
  }
}
