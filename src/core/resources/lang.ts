import { Type } from 'class-transformer';
import { IsString, ValidateNested, IsDefined } from 'class-validator';
import { MessageValidator, ButtonValidator } from '@contracts';

class Interaction {
  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  'in-cooldown': MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  'no-permission': MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  'channel-restricted': MessageValidator
}

class Plugin {
  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  list: MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  enabled: MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  disabled: MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  'already-enabled': MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  'already-disabled': MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  'not-found': MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  reloaded: MessageValidator
}

class Pagination {
  @IsDefined()
  @IsString()
  'select-placeholder': string

  @IsDefined()
  @IsString()
  'filters-placeholder': string

  @IsDefined()
  @IsString()
  placeholder: string

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  'no-data': MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => ButtonValidator)
  'button-next': ButtonValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => ButtonValidator)
  'button-previous': ButtonValidator
}

class Leaderboard extends MessageValidator {
  @IsDefined()
  @IsString()
  'messages-format': string
}

export default class DefaultConfig {
  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  'no-permission': MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  'in-cooldown': MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  'only-in-primary-guild': MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => Pagination)
  pagination: Pagination

  @IsDefined()
  @ValidateNested()
  @Type(() => Interaction)
  interaction: Interaction

  @IsDefined()
  @ValidateNested()
  @Type(() => Plugin)
  plugin: Plugin

  @IsDefined()
  @ValidateNested()
  @Type(() => Leaderboard)
  leaderboard: Leaderboard

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  'server-info': MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  parsed: MessageValidator
}
