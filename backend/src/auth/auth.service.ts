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

  async syncGoogleUser(email: string, googleId: string, name?: string) {
    // 1. Find if user already exists by googleId
    let user = await this.prisma.user.findUnique({
      where: { googleId },
    });

    if (user) {
      return user;
    }

    // 2. Try finding by email
    if (email) {
      user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (user) {
        // Update with googleId
        return this.prisma.user.update({
          where: { id: user.id },
          data: { googleId, name, isGuest: false },
        });
      }
    }

    // 3. Create new user, handle race condition (React Strict Mode double mount)
    try {
      return await this.prisma.user.create({
        data: {
          email,
          googleId,
          name,
          isGuest: false,
        },
      });
    } catch (error: any) {
      // P2002 is the Prisma error code for Unique constraint failed
      if (error.code === 'P2002') {
        // If it failed because another request just created it, fetch it
        return await this.prisma.user.findUnique({
          where: { googleId },
        });
      }
      throw error;
    }
  }
}
