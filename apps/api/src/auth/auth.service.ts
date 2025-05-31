import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import * as bcrypt from 'bcrypt';
import { Role } from './enums/role.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleRegisterDto } from './dto/google-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,

  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && user.passwordHash) {
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (isPasswordValid) {
        // Determine user's role
        let role: Role = Role.CLIENT; // Default role
        if (user.administrator) {
          role = Role.ADMINISTRATOR;
        } else if (user.client) {
          role = Role.CLIENT;
        } else if (user.serviceProvider) {
          role = Role.SERVICE_PROVIDER;
        }

        const { passwordHash, ...result } = user;
        return { ...result, role };
      }
    }

    return null;
  }

  async login(user: any) {
    const tokens = await this.getTokens(user.id, user.email, user.role);

    const roleKey = user.role ?? "client";
    let roleData = user[roleKey];

    console.log('ROLE DATA:', roleData);
    console.log("roleKey", roleKey);
    return {
      ...tokens,
      user: {
        id: user.id,
        firstName: roleData?.firstName,
        lastName: roleData?.lastName,
        avatar: user.avatarUrl,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { refreshToken } = refreshTokenDto;
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findById(payload.userId);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const role = await this.usersService.getUserRole(user.id) || Role.CLIENT;
      return this.getTokens(user.id, user.email, role);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async register(registerDto: RegisterDto, avatarFile?: Express.Multer.File) {
    return this.usersService.create(registerDto, avatarFile);
  }

  async getUserFromToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return this.usersService.findById(payload.userId);
    } catch (error) {
      return null;
    }
  }

  private async getTokens(userId: string, email: string, role: Role) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          email,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          userId,
          email,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  async validateGoogleUser(googleUser: GoogleRegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: googleUser.email,
      },
      include: {
        client: true,
        serviceProvider: true,
        administrator: true,
      },
    });
    if (user) {
      const { passwordHash, ...authUser } = user;
      return authUser;
    }

    const dbUser = await this.prisma.user.create({
      data: {
        email: googleUser.email,
        avatarUrl: googleUser.avatarUrl,
        client: {
          create: {
            firstName: googleUser.firstName,
            lastName: googleUser.lastName,
          }
        }
      },
      include: { client: true, administrator: true, serviceProvider: true }, // <-- include all roles

    });
    const { passwordHash, ...authUser } = dbUser;
    authUser;
  }
}