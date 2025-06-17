import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles (Role.ADMINISTRATOR)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }
  
  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  async toggleStatus(
    @Param('id') id: string,
    @CurrentUser() currentUser: any
  ) {
    if (currentUser.role !== Role.ADMINISTRATOR) {
      throw new ForbiddenException('Only administrators can ban/unban users');
    }

    if (id === currentUser.userId) {
      throw new ForbiddenException('You cannot ban/unban yourself');
    }

    return this.userService.toggleStatus(id);
  }

  @Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
async update(
  @Param('id') id: string,
  @Body() updateUserDto: UpdateUserDto,
  @CurrentUser() currentUser: any
) {
  // Check if user is admin or updating their own profile
  if (currentUser.role !== Role.ADMINISTRATOR && currentUser.userId !== id) {
    throw new ForbiddenException('You can only update your own profile');
  }
  
  return this.userService.update(id, updateUserDto);
}

@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
async remove(
  @Param('id') id: string,
  @CurrentUser() currentUser: any
) {
  if (currentUser.role !== Role.ADMINISTRATOR && currentUser.userId !== id) {
    throw new ForbiddenException('You can only delete your own account');
  }
  return this.userService.remove(id);
}
}
