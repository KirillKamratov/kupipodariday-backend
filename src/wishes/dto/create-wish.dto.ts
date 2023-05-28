import { IsString, IsUrl, MaxLength, Min, MinLength } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @MinLength(1, {
    message: 'Минимальная длина поля - 1 символ',
  })
  @MaxLength(250, {
    message: 'Максимальная длина поля - 250 символов',
  })
  name: string;

  @IsString()
  @IsUrl()
  link: string;

  @Min(1)
  price: number;

  @IsString()
  @MinLength(1, {
    message: 'Минимальная длина поля - 1 символ',
  })
  @MaxLength(1024, {
    message: 'Максимальная длина поля - 1024 символа',
  })
  description: string;
}
