import { Type } from 'class-transformer';
import { IsString, IsInt, IsIn, IsArray, IsBoolean, IsOptional, ValidateNested, IsDefined, ArrayMaxSize, IsNumber, Validate, MaxLength } from 'class-validator';
import { IsTextInputStyle } from '../decorators/validator.js';

class OptionsValidator {
  @IsOptional()
  @IsString()
  label: string

  @IsOptional()
  @IsString()
  value: string

  @IsOptional()
  @IsString()
  emoji: string

  @IsOptional()
  @IsBoolean()
  default: boolean

  @IsOptional()
  @IsString()
  description: string
}

class TextInputValidator {
  @IsDefined()
  @IsString()
  id: string

  @IsDefined()
  @IsString()
  @MaxLength(45)
  label: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  placeholder: string

  @IsOptional()
  @IsBoolean()
  required: boolean

  @IsOptional()
  @IsNumber()
  maxLenght: number

  @IsOptional()
  @IsString()
  value: string

  @IsOptional()
  @IsString()
  @Validate(IsTextInputStyle)
  style: string
}

export class ModalValidator {
  @IsDefined()
  @IsString()
  title: string

  @IsDefined()
  @IsArray()
  @ArrayMaxSize(5)
  @ValidateNested()
  @Type(() => TextInputValidator)
  components: TextInputValidator[]
}

export class ButtonValidator {
  @IsOptional()
  @IsString()
  @IsString({ each: true })
  style: string | string[]

  @IsOptional()
  @IsString()
  @IsString({ each: true })
  customId: string | string[]

  @IsOptional()
  @IsBoolean()
  @IsBoolean({ each: true })
  disabled: boolean | boolean[]

  @IsOptional()
  @IsString()
  @IsString({ each: true })
  label: string | string[]

  @IsOptional()
  @IsString()
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  emoji: string | string[]

  @IsOptional()
  @IsString()
  @IsString({ each: true })
  url: string | string[]
}

export class ComponentValidator extends ButtonValidator {
  @IsOptional()
  @IsString()
  @IsIn(["button", "select-menu"])
  type: string

  @IsOptional()
  @IsString()
  placeholder: string

  @IsOptional()
  @IsInt()
  minValues: number

  @IsOptional()
  @IsInt()
  maxValues: number

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionsValidator)
  options: OptionsValidator[]
}