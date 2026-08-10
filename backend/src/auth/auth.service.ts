import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async createGuestUser() {
    return this.prisma.user.create({
      data: {
        isGuest: true,
      },
    });
  }
}
