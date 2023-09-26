import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'draft_posts',
})
export class DraftPosts extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ allowNull: false, type: DataType.JSON })
  post: JSON;

  // @Column({ allowNull: false, type: DataType.TEXT })
  // title: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  url: string;
}
