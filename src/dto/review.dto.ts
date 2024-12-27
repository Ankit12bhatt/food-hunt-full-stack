import { IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  leftoverId: string;

  @IsNotEmpty()
  review: string;

  @IsNotEmpty()
  star: number;
}
