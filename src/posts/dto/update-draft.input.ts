import { InputType, Field, ObjectType, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class UpdateDraftFieldDto {
  @Field(() => ID)
  id: string;

  @Field()
  fieldName: string;
  @Field(() => GraphQLJSON)
  newValue: Record<string, any>;
}

@ObjectType()
export class DraftType {
  @Field(() => String)
  id: string;

  @Field(() => GraphQLJSON)
  post: Record<string, any>;

  // @Field()
  // title: string;

  @Field()
  url: string;
}
