import { IsActivityType } from '@contracts';
import { Type } from 'class-transformer';
import { IsString, IsInt, ValidateNested, IsBoolean, Validate, IsDefined, NotEquals, IsHexColor, IsIn, IsPositive } from 'class-validator';

class Activity {
  @IsDefined()
  @IsString()
  text: string;

  @IsDefined()
  @IsString()
  @Validate(IsActivityType)
  type: string;
}

class Presence {
  @IsDefined()
  @IsInt()
  interval: number;

  @IsDefined()
  @IsString()
  status: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => Activity)
  activities: Activity[];
}

class Database {
  @IsDefined()
  @IsString()
  @IsIn(['mysql', 'sqlite', 'mariadb'])
  type: string;

  @IsDefined()
  @IsString()
  host: string;

  @IsDefined()
  @IsInt()
  @IsPositive()
  port: number

  @IsDefined()
  @IsString()
  username: string;

  @IsDefined()
  @IsString()
  password: string;

  @IsDefined()
  @IsString()
  database: string;

  @IsDefined()
  @IsBoolean()
  debug: boolean;
}

class LogConfig {
  @IsDefined()
  @IsBoolean()
  enabled: boolean;

  @IsDefined()
  @IsString()
  channel: string;
}

class Log {
  @IsDefined()
  @ValidateNested()
  @Type(() => LogConfig)
  minor: LogConfig;

  @IsDefined()
  @ValidateNested()
  @Type(() => LogConfig)
  moderate: LogConfig;

  @IsDefined()
  @ValidateNested()
  @Type(() => LogConfig)
  high: LogConfig;

  @IsDefined()
  @ValidateNested()
  @Type(() => LogConfig)
  major: LogConfig;

  @IsDefined()
  @ValidateNested()
  @Type(() => LogConfig)
  critical: LogConfig;
}

export default class DefaultConfig {
  @IsDefined()
  @IsString()
  @NotEquals('BOT_TOKEN', {
    message: 'Please set your bot token in the configs/config.yml file.',
  })
  token: string

  @IsDefined()
  @IsString()
  @NotEquals('GUILD_ID', {
    message: 'Please set your guild id in the configs/config.yml file.',
  })
  'primary-guild': string

  @IsDefined()
  @IsString()
  @IsHexColor()
  'default-color': string

  @IsDefined()
  @IsBoolean()
  debug: boolean

  @IsDefined()
  @ValidateNested()
  @Type(() => Presence)
  presence: Presence

  @IsDefined()
  @ValidateNested()
  @Type(() => Database)
  database: Database

  @IsDefined()
  @ValidateNested()
  @Type(() => Log)
  log: Log
}