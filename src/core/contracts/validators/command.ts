import { IsString, IsInt, IsArray, IsBoolean, IsOptional, IsDefined, NotEquals, Validate } from 'class-validator';
import { IsPermissionFlag } from '@contracts';

export class CommandValidator {
  @IsOptional()
  @IsBoolean()
  enabled: boolean

  @IsOptional()
  @IsBoolean()
  inherited: boolean

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  aliases: string[]

  @IsOptional()
  @IsInt()
  @NotEquals(0)
  cooldown: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  channels: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  users: string[]

  @IsOptional()
  @IsString()
  @Validate(IsPermissionFlag)
  permission: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Validate(IsPermissionFlag, { each: true })
  permissions: string

  @IsDefined()
  @IsString()
  description: string

  @IsOptional()
  subcommands: unknown

  @IsOptional()
  options: unknown
}
