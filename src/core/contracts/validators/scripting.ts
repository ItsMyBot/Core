
import { Type } from 'class-transformer';
import { IsString, IsInt, ValidateNested, IsOptional, IsDefined, Max, Min, IsPositive, IsArray, IsBoolean, IsNumber } from 'class-validator';
import { MessageValidator } from '@contracts';

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
  @IsString({ each: true })
  value: string[] | string

  @IsOptional()
  @IsNumber()
  amount: number

  @IsOptional()
  @IsBoolean()
  inherit: boolean

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
  @IsOptional()
  @IsString()
  content: string

  @IsOptional()
  @IsString()
  channel: string

  @IsOptional()
  @IsString()
  role: string

  @IsOptional()
  @IsString()
  guild: string

  @IsOptional()
  @IsString()
  member: string

  @IsOptional()
  @IsString()
  user: string
}

class ActionArgumentValidator extends MessageValidator {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionValidator)
  actions: ActionValidator[]

  @IsOptional()
  @IsString({ each: true })
  value: string | string[]

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
  @IsInt()
  @IsPositive()
  duration: number
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
  @ValidateNested()
  @Type(() => MutatorValidator)
  mutators: MutatorValidator
}

export class TriggerActionValidator extends ActionValidator {
  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  triggers: string[]
}