import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

// Define que essa classe é um resolver para o tipo 'Post'
@Resolver('Post')
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  // Operação de mutação para criar um novo post
  @Mutation('createPost')
  create(@Args('createPostInput') createPostInput: CreatePostInput) {
    return this.postsService.create(createPostInput);
  }

  // Operação de consulta para buscar todos os posts
  @Query('posts')
  findAll() {
    return this.postsService.findAll();
  }

  // Operação de consulta para buscar um post por ID
  @Query('post')
  findOne(@Args('id') id: number) {
    return this.postsService.findOne(id);
  }

  // Operação de mutação para atualizar um post existente
  @Mutation('updatePost')
  update(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postsService.update(updatePostInput.id, updatePostInput);
  }

  // Operação de mutação para remover um post por ID
  @Mutation('removePost')
  remove(@Args('id') id: number) {
    return this.postsService.remove(id);
  }
}
