// draft.model.ts
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'draft_posts' }) // Especifica o nome da tabela no banco de dados
export class Draft extends Model<Draft> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  post: JSON;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;
}
