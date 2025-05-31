import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../enums/role.enum';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      // Support both Authorization header and session cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          try {
            const sessionCookie = request?.cookies?.session;
            if (!sessionCookie) return null;

            // Decode the session JWT to get the payload
            const sessionPayload = jwt.verify(sessionCookie, process.env.SESSION_SECRET_KEY!) as any;
            
            // Extract the accessToken from the session payload
            return sessionPayload?.accessToken || null;
          } catch (error) {
            console.error('Error extracting token from session:', error);
            return null;
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { userId: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        administrator: true,
        client: true,
        serviceProvider: true,
      },
    });

    if (!user) {
      return null;
    }

    // Determine the user's role
    let role: Role = Role.CLIENT;
    if (user.administrator) {
      role = Role.ADMINISTRATOR;
    } else if (user.client) {
      role = Role.CLIENT;
    } else if (user.serviceProvider) {
      role = Role.SERVICE_PROVIDER;
    }

    return {
      userId: user.id,
      email: user.email,
      role,
    };
  }
}