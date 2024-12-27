import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLeftoverDto {
  @IsString()
  @IsNotEmpty()
  readonly productId: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly originalPrice: number;

  @IsNotEmpty()
  @IsEnum(
    [
      'Starter',
      'Beverage',
      'Dessert',
      'Breakfast',
      'Fastfood',
      'Lunch',
      'Dinner',
    ],
    {
      message: 'invalid category',
    },
  )
  readonly category:
    | 'Starter'
    | 'Beverage'
    | 'Dessert'
    | 'Breakfast'
    | 'Fastfood'
    | 'Lunch'
    | 'Dinner';

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;

  @IsNotEmpty()
  @IsNumber()
  readonly reducedPrice: number;

  @IsNotEmpty()
  readonly onset;

  @IsNotEmpty()
  readonly offset;
}
