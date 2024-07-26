import { Type } from 'class-transformer';
import { IsString, ValidateNested, IsOptional, IsDefined, IsArray, IsBoolean, IsNumber, Validate } from 'class-validator';
import { ConditionValidator, ActionValidator } from './script.js';
import { IsChannelType, IsCommandOptionType } from 'core/contracts/decorators/validator.js';
import { CommandValidator } from '@contracts';

class ChoiceOptionValidator {
  @IsDefined()
  @IsString()
  name: string

  @IsDefined()
  @IsString()
  value: string
}

class CommandOptionValidator {
  @IsDefined()
  @IsString()
  name: string

  @IsDefined()
  @IsString()
  description: string

  @IsDefined()
  @IsString()
  @Validate(IsCommandOptionType)
  type: string

  @IsOptional()
  @IsBoolean()
  required: boolean

  @IsOptional()
  @IsNumber()
  maxLength: number

  @IsOptional()
  @IsNumber()
  minLength: number

  @IsOptional()
  @IsNumber()
  minValue: number

  @IsOptional()
  @IsNumber()
  maxValue: number

  @IsOptional()
  @IsString()
  @Validate(IsChannelType)
  channelType: string

  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => ChoiceOptionValidator)
  choices: ChoiceOptionValidator[]
}

export default class DefaultConfig extends CommandValidator {
  @IsDefined()
  @IsString()
  name: string

  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CommandOptionValidator)
  declare options: CommandOptionValidator[]

  @IsDefined()
  @IsArray()
  @ValidateNested()
  @Type(() => ActionValidator)
  actions: ActionValidator

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConditionValidator)
  conditions: ConditionValidator[]
}
