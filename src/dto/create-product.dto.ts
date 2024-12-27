import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly productName: string;

  @IsNotEmpty()
  @IsEnum(['Veg', 'Non Veg'], {
    message: 'invalid type',
  })
  readonly type: 'Veg' | 'Non Veg';

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
  readonly price: string;

  @IsString()
  @IsNotEmpty()
  readonly ingredients: string;
}
