import { userMention } from 'discord.js';
import { Optional, DataTypes } from 'sequelize';
import { Table, Model, Column } from 'sequelize-typescript';

interface UserAttributes {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null
  createdAt: number;
  joinedAt: number | undefined;
  roles: string[];
  coins: number | undefined;
  messages: number | undefined;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

@Table
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column({
    type: DataTypes.STRING,
    primaryKey: true
  })
  declare id: string;

  @Column({
    type: DataTypes.STRING
  })
  declare username: string;

  @Column({
    type: DataTypes.STRING
  })
  declare displayName: string;

  @Column({
    type: DataTypes.STRING
  })
  declare avatar: string;

  @Column({
    type: DataTypes.INTEGER
  })
  declare createdAt: number;

  @Column({
    type: DataTypes.INTEGER
  })
  declare joinedAt: number;

  @Column({
    type: DataTypes.JSON
  })
  declare roles: string[];

  @Column({
    type: DataTypes.INTEGER,
    defaultValue: 0
  })
  declare coins: number;

  @Column({
    type: DataTypes.INTEGER,
    defaultValue: 0
  })
  declare messages: number

  get mention(): string {
    return userMention(this.id);
  }

  async addCoins(amount: number) {
    this.coins += amount;
    await this.save();
  }

  async removeCoins(amount: number) {
    if (this.coins >= amount) {
      this.coins -= amount;
      await this.save();
    } else {
      throw new Error("Insufficient coins");
    }
  }

  async setCoins(amount: number) {
    this.coins = amount;
    await this.save();
  }

  hasCoins(amount: number) {
    return this.coins >= amount;
  }
}