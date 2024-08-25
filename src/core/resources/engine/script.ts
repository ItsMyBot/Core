import { Type } from 'class-transformer';
import { IsString, IsInt, ValidateNested, IsOptional, IsDefined, Max, Min, IsPositive, IsArray, IsBoolean, IsNumber } from 'class-validator';
import { MessageValidator } from '@contracts';

export class ConditionArgValidator {
  @IsOptional()
  @IsBoolean()
  inverse: boolean

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionValidator)
  notMetActions: ActionValidator[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  text: string[]

  @IsOptional()
  @IsNumber()
  amount: number
}

export class ConditionValidator {
  @IsDefined()
  @IsString()
  id: string

  @IsOptional()
  @ValidateNested()
  @Type(() => ConditionArgValidator)
  args: ConditionArgValidator
}


export class MutatorValidator {
  @IsDefined()
  @IsString()
  id: string

  @IsDefined()
  args: any
}

class ActionArgValidator extends MessageValidator {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionValidator)
  actions: ActionValidator[]

  @IsOptional()
  @IsString()
  channel: string

  @IsOptional()
  @IsString()
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
  @Type(() => ActionArgValidator)
  args: ActionArgValidator

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

class TriggerActionValidator extends ActionValidator {
  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  triggers: string[]
}

export default class DefaultConfig {
  @IsDefined()
  @IsArray()
  @ValidateNested()
  @Type(() => TriggerActionValidator)
  actions: TriggerActionValidator

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConditionValidator)
  conditions: ConditionValidator[]
}
