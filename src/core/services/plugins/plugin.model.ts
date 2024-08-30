import { DataTypes, Optional } from 'sequelize';
import { Table, Model, Column } from 'sequelize-typescript';


interface PluginAttributes {
  name: string;
  enabled: boolean;
}

interface PluginCreationAttributes extends Optional<PluginAttributes, 'name'> { }

@Table
export default class Plugin extends Model<PluginAttributes, PluginCreationAttributes> {
  @Column({
    type: DataTypes.STRING,
    primaryKey: true
  })
  declare name: string;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: 1
  })
  declare enabled: boolean;
}
