import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'latest_publications',
})
export class LatestPublications extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  site_key: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  title: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  url: string;
}
