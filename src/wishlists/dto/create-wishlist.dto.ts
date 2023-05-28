import {
  IsArray,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @MinLength(1, {
    message: 'Минимальная длина поля - 1 символ',
  })
  @MaxLength(250, {
    message: 'Максимальная длина поля - 250 символов',
  })
  name: string;

  @IsUrl()
  image?: string;

  @IsString()
  @MaxLength(1500, {
    message: 'Максимальная длина поля - 1500 символов',
  })
  description: string;

  @IsArray()
  items?: number[];
}
