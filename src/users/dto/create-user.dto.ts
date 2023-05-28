import {
  IsString,
  MaxLength,
  MinLength,
  IsUrl,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, {
    message: 'Минимальная длина поля - 2 символа',
  })
  @MaxLength(30, {
    message: 'Максимальная длинна поля - 30 символов',
  })
  username: string;

  @IsString()
  @MinLength(2, {
    message: 'Минимальная длина поля - 2 символа',
  })
  @MaxLength(200, {
    message: 'Максимальная длинна поля - 200 символов',
  })
  about?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsUrl()
  avatar?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
