// drafts.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Draft } from './entities/post.entity';
import { DraftPosts } from '@/article/entities/draftPosts';
import { UpdateDraftFieldDto } from './dto/update-draft.input';

@Injectable()
export class DraftsService {
  // constructor(
  //   @InjectModel(DraftPosts)
  //   private readonly draftModel: typeof DraftPosts,
  // ) {}

  async findAllDrafts(): Promise<DraftPosts[]> {
    return DraftPosts.findAll();
  }

  async updateDraftField(input: UpdateDraftFieldDto): Promise<DraftPosts> {
    const { id, fieldName, newValue } = input;
    try {
      // Encontre o usuário pelo ID
      const draft = await DraftPosts.findByPk(id);

      if (draft) {
        // Atualize o campo dinamicamente
        draft[fieldName] = newValue;
        await draft.save();
        return draft;
      } else {
        throw new Error('Draft não encontrado.');
      }
    } catch (error) {
      throw new Error(
        `Erro ao atualizar o campo ${fieldName}: ${error.message}`,
      );
    }
  }
}
