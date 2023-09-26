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
