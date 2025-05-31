import {Request, Controller, Post, Body, UseGuards, Get, Req, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UploadedFile, UseInterceptors, Delete, HttpCode, HttpStatus, Param, Patch, NotFoundException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { CurrentUser } from './decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../user/user.service'; // Adjust the path as needed
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() { }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req, @Res() res: Response) {
    // console.log('user:', req.user);

    const userData = await this.authService.login(req.user);

    res.redirect(
      `http://localhost:3000/api/auth/google/callback?userId=${userData.user.id}&firstName=${userData.user.firstName}&lastName=${userData.user.lastName}&role=${userData.user.role}&email=${userData.user.email}&avatar=${userData.user.avatar}&accessToken=${userData.access_token}`,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  verify() {
    return 'ok';
  }
  @Post('register') // This is now the single endpoint for registration
  @UseInterceptors(FileInterceptor('avatar')) // 'avatar' is the field name for the file in the form
  async register(
    @Body() registerDto: RegisterDto, // DTO for non-file data
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false, // <--- THIS IS THE KEY CHANGE: Avatar is now OPTIONAL
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // Max 5MB (adjust as needed)
          new FileTypeValidator({ fileType: 'image/(jpeg|png|gif|webp)' }), // Allowed image types
        ],
      }),
    )
    avatarFile?: Express.Multer.File, // The actual avatar file (will be undefined if not sent)
  ) {
    // We directly call usersService.create, passing the DTO and the optional file.
    // The UsersService.create method is already designed to handle `avatarFile` being `undefined`.
    const createdUser = await this.authService.register(registerDto, avatarFile);
    return {
      message: 'User registered successfully',
      user: createdUser,
    };
  }
  @Patch(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUserAvatar(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true, // Avatar is required for this specific update endpoint
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'image/(jpeg|png|gif|webp)' }),
        ],
      }),
    )
    newAvatarFile: Express.Multer.File,
  ) {
    const updatedUser = await this.usersService.update(id, {}, newAvatarFile);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'Avatar updated successfully',
      avatarUrl: updatedUser.avatarUrl,
      userId: updatedUser.id,
    };
  }

  // --- Endpoint to DELETE USER AVATAR ---
  @Delete(':id/avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserAvatar(
    @Param('id') id: string,
  ) {
    await this.usersService.removeAvatar(id);
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req) {
    console.log('USER AFTER LOGIN:', req.user);
    return this.authService.login(req.user);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user) {
    return user;
  }

  // Example endpoint with role-based access control
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  @Get('admin-only')
  getAdminData() {
    return { message: 'This is protected data only for administrators' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Get('client-only')
  getClientData() {
    return { message: 'This is protected data only for clients' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SERVICE_PROVIDER)
  @Get('provider-only')
  getProviderData() {
    return { message: 'This is protected data only for service providers' };
  }
}
