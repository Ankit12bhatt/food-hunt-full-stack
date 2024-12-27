import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsLowercase,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim(), { toClassOnly: true })
  readonly businessName: string;

  @IsNotEmpty()
  @IsEnum(['buyer', 'seller'], {
    message: 'valid role required',
  })
  readonly role: 'buyer' | 'seller';

  @IsNotEmpty()
  @Matches(/^(\+[0-9]{1,3}[- ]?)?\(?[0-9]{3}\)?[- ]?[0-9]{3}[- ]?[0-9]{4}$/, {
    message: 'Invalid contact number format',
  })
  readonly contactNumber: number;

  @IsString()
  @MaxLength(30)
  @MinLength(5)
  @IsNotEmpty()
  readonly address: string;

  @IsEmail()
  @IsLowercase()
  @IsNotEmpty()
  readonly email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  readonly password: string;
}
