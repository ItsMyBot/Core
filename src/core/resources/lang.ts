import { Type } from 'class-transformer';
import { IsString, ValidateNested, IsDefined } from 'class-validator';
import { MessageValidator, ButtonValidator } from '@contracts';

class Interaction {
  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  inCooldown: MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  noPermission: MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  channelRestricted: MessageValidator
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
  alreadyEnabled: MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  alreadyDisabled: MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  notFound: MessageValidator
}

class Pagination {
  @IsDefined()
  @IsString()
  selectPlaceholder: string

  @IsDefined()
  @IsString()
  filtersPlaceholder: string

  @IsDefined()
  @IsString()
  placeholder: string

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  noData: MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => ButtonValidator)
  buttonNext: ButtonValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => ButtonValidator)
  buttonPrevious: ButtonValidator
}

class Leaderboard extends MessageValidator {
  @IsDefined()
  @IsString()
  messagesFormat: string
}

export default class DefaultConfig {
  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  noPermission: MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  inCooldown: MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  onlyInPrimaryGuild: MessageValidator

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
  serverInfo: MessageValidator

  @IsDefined()
  @ValidateNested()
  @Type(() => MessageValidator)
  parsed: MessageValidator
}
