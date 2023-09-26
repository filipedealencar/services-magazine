import { Module } from '@nestjs/common';
import { DraftsService } from './posts.service';
import { DraftsResolver } from './posts.resolver';

@Module({
  providers: [DraftsResolver, DraftsService],
})
export class PostsModule {}
