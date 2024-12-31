import Utils from '@utils';
import { ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ name: 'isPermissionFlag', async: false })
export class IsPermissionFlag implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const permission = Utils.permissionFlags(value.toString());
    return permission !== undefined;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Permission must be a valid permission flag.';
  }
}


@ValidatorConstraint({ name: 'isActivityType', async: false })
export class IsActivityType implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const activityType = Utils.activityType(value.toString());
    return activityType !== undefined;
  }

  defaultMessage(args: ValidationArguments) {
    return 'This is not a valid activity type. Please use one of the following: PLAYING, STREAMING, LISTENING, WATCHING, COMPETING';
  }
}


@ValidatorConstraint({ name: 'isTextInputStyle', async: false })
export class IsTextInputStyle implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const textInputStyle = Utils.textInputStyle(value.toString());
    return textInputStyle !== undefined;
  }

  defaultMessage(args: ValidationArguments) {
    return 'This is not a valid activity type. Please use one of the following: PLAYING, STREAMING, LISTENING, WATCHING, COMPETING';
  }
}


@ValidatorConstraint({ name: 'isCommandOptionType', async: false })
export class IsCommandOptionType implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const commandOptionType = Utils.commandOptionType(value.toString());
    return commandOptionType !== undefined;
  }

  defaultMessage(args: ValidationArguments) {
    return 'This is not a command option type.';
  }
}


@ValidatorConstraint({ name: 'isChannelType', async: false })
export class IsChannelType implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const channelType = Utils.channelType(value.toString());
    return channelType !== undefined;
  }

  defaultMessage(args: ValidationArguments) {
    return 'This is not a command option type.';
  }
}

@ValidatorConstraint({ name: 'isBooleanOrString', async: false })
export class IsBooleanOrString implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return typeof value === 'boolean' || typeof value === 'string';
  }

  defaultMessage(args: ValidationArguments) {
    return 'This is not a valid type. Please use either a boolean or a string.';
  }
}