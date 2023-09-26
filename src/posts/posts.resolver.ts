// drafts.resolver.ts
import {
  Resolver,
  Query,
  Args,
  Mutation,
  ObjectType,
  Field,
  Int,
} from '@nestjs/graphql';
import { Draft } from './entities/post.entity';
import { DraftsService } from './posts.service';
import { DraftPosts } from '@/article/entities/draftPosts';
import GraphQLJSON from 'graphql-type-json';
import { DraftType, UpdateDraftFieldDto } from './dto/update-draft.input';

@Resolver('Draft')
export class DraftsResolver {
  constructor(private readonly draftsService: DraftsService) {}

  @Query(() => [DraftType])
  async drafts(): Promise<DraftPosts[]> {
    return this.draftsService.findAllDrafts();
  }

  @Mutation(() => DraftType)
  async updateDraft(@Args('input') input: UpdateDraftFieldDto) {
    return this.draftsService.updateDraftField(input);
  }
}
