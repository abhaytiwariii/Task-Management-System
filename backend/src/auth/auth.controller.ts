import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  async createGuest() {
    return this.authService.createGuestUser();
  }

  @Post('sync')
  async syncGoogleUser(
    @Body() body: { email: string; googleId: string; name?: string },
  ) {
    return this.authService.syncGoogleUser(body.email, body.googleId, body.name);
  }
}
