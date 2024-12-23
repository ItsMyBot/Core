
import { Type } from 'class-transformer';
import { IsString, IsInt, ValidateNested, Validate, IsOptional, IsDefined, Max, Min, IsPositive, IsArray, IsBoolean, IsNumber } from 'class-validator';
import { MessageValidator, IsStringOrStrings } from '@contracts';

class ConditionArgumentValidator {
  @IsOptional()
  @IsBoolean()
  inverse: boolean

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionValidator)
  'not-met-actions': ActionValidator[]

  @IsOptional()
  @Validate(IsStringOrStrings)
  text: string[] | string

  @IsOptional()
  @IsNumber()
  amount: number

  @IsOptional()
  @IsBoolean()
  inherit: boolean

  @IsOptional()
  @IsString()
  role: string

  @IsOptional()
  @IsString()
  input: string

  @IsOptional()
  @IsString()
  operator: string

  @IsOptional()
  @IsString()
  output: string
}

export class ConditionValidator {
  @IsDefined()
  @IsString()
  id: string

  @IsOptional()
  @ValidateNested()
  @Type(() => ConditionArgumentValidator)
  args: ConditionArgumentValidator
}

export class MutatorValidator {
  @IsDefined()
  @IsString()
  id: string

  @IsDefined()
  args: any
}

class ActionArgumentValidator extends MessageValidator {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionValidator)
  actions: ActionValidator[]

  @IsOptional()
  @IsString()
  channel: string

  @IsOptional()
  @Validate(IsStringOrStrings)
  role: string

  @IsOptional()
  @IsString()
  emoji: string

  @IsOptional()
  @IsInt()
  @IsPositive()
  every: number

  @IsOptional()
  @IsInt()
  @IsPositive()
  cooldown: number

  @IsOptional()
  @IsInt()
  @IsPositive()
  delay: number

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  chance: number

  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsInt()
  @IsPositive()
  duration: number

  @IsOptional()
  @IsString()
  form: string
}

export class ActionValidator {
  @IsOptional()
  @IsString()
  id: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionValidator)
  actions: ActionValidator[]

  @IsOptional()
  @ValidateNested()
  @Type(() => ActionArgumentValidator)
  args: ActionArgumentValidator

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConditionValidator)
  conditions: ConditionValidator[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MutatorValidator)
  mutators: MutatorValidator[]
}

export class TriggerActionValidator extends ActionValidator {
  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  triggers: string[]
}