import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { ChangeAdminPermissionsDto } from './dto/change-adminPermissions.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { AdminPermissionsGuard } from '../auth/guards/admin-permissions.guard';
import { UserRoles } from '../auth/decorators/user-roles.decorator';
import { AdminPermission, UserRole } from './types';
import { AdminPermissions } from '../auth/decorators/admin-permissions.decorator';
import { AuthUser } from '../auth/decorators/auth-user.decorator';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.MASTER)
  @Post('admin')
  async createAdmin(@Body(new ValidationPipe()) userData: CreateAdminDto): Promise<User> {
    try {
      return await this.userService.createAdmin(userData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    try {
      return await this.userService.createUser(userData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':own')
  async getOwnUser(@AuthUser() user: User): Promise<User | undefined> {
    return this.userService.findUserById(user._id.toString());
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | undefined> {
    return this.userService.findUserById(id);
  }

  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.CONFIRMATION)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const objectId = new ObjectId(id);
    await this.userService.deleteUserById(objectId);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    try {
      return this.userService.updateOne(id, updateUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.CONFIRMATION)
  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body(new ValidationPipe()) changeStatusDto: ChangeStatusDto
  ) {
    return this.userService.changeStatus(id, changeStatusDto.status);
  }

  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.KEYS)
  @Patch(':id/key')
  async giveKey(@Param('id') id: string) {
    return this.userService.giveKey(id);
  }

  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.MASTER)
  @Patch(':id/admin-permissions')
  async changeAdminPermissions(
    @Param('id') id: string,
    @Body(new ValidationPipe()) changeAdminPermissionsDto: ChangeAdminPermissionsDto
  ) {
    return this.userService.changeAdminPermissions(id, changeAdminPermissionsDto.permissions);
  }

  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.CONFIRMATION)
  @Patch(':id/block')
  async blockUser(@Param('id') id: string) {
    return this.userService.blockUser(id);
  }
}