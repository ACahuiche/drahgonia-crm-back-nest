import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body('userEmail') userEmail: string, @Body('userPassword') userPassword: string) {
    return this.authService.login(userEmail, userPassword);
  }
}
