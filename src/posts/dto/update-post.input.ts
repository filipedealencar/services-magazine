// Importa o tipo CreatePostInput do arquivo './create-post.input'
import { CreatePostInput } from './create-post.input';

// Importa o utilitário PartialType do pacote '@nestjs/mapped-types'
import { PartialType } from '@nestjs/mapped-types';

// Define uma classe chamada UpdatePostInput que herda do tipo PartialType(CreatePostInput)
export class UpdatePostInput extends PartialType(CreatePostInput) {
  // Adiciona uma nova propriedade 'id' ao tipo UpdatePostInput
  id: number;
}
