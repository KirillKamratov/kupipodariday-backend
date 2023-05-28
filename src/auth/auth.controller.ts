import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalGuard } from '../utils/local/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signIn(@Req() req) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    return this.authService.auth(user);
  }
}
