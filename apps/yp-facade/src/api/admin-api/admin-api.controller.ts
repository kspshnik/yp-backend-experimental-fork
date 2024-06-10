import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MethodNotAllowedException } from '@nestjs/common/exceptions';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../../core/users/users.service';
import { NewAdminDto } from './dto/new-admin.dto';
import { AnyUserInterface, UserRole } from '../../common/types/user.types';
import { AccessControlGuard } from '../../common/guards/access-control.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccessControlList } from '../../common/decorators/access-control-list.decorator';
import { AccessRights } from '../../common/types/access-rights.types';
import { PostDTO } from './dto/new-post.dto';
import { BlogService } from '../../core/blog/blog.service';
import { ApiCreateCategoryDto } from './dto/new-category.dto';
import { ApiUpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from '../../core/categories/categories.service';
import { TasksService } from '../../core/tasks/tasks.service';
import { ApiPrivilegesDto } from './dto/privileges.dto';
import { ResolveResult } from '../../common/types/task.types';

@UseGuards(JwtAuthGuard)
@UseGuards(AccessControlGuard)
@Controller('admin')
@ApiTags('Administrative API. Guarded.')
export class AdminApiController {
  constructor(
    private readonly usersService: UsersService,
    private readonly blogService: BlogService,
    private readonly categoryService: CategoriesService,
    private readonly tasksService: TasksService
  ) {}

  @Get('all')
  @ApiTags('Get a list of administrators')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.confirmUser] })
  public async getAdministrators() {
    return this.usersService.getAdministrators();
  }

  @Post('create')
  @ApiTags('Create an administrative user. Root only.')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async create(@Body() dto: NewAdminDto) {
    return this.usersService.createAdmin({
      role: UserRole.ADMIN,
      ...dto,
      permissions: [],
      isRoot: false,
    });
  }

  @Put(':id/activate')
  @ApiTags('Activate an administrator. Root only.')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async activate(@Param('id') _id: string) {
    return this.usersService.activate(_id);
  }

  @Delete(':id/activate')
  @ApiTags('Block (deactivate) an administrator. Root only.')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async deactivate(@Param('id') _id: string) {
    return this.usersService.deactivate(_id);
  }

  @Put(':id/privileges')
  @ApiTags('Grant administrator privileges. Root only.')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  public async grantPrivileges(@Param('id') userId, @Body() dto: ApiPrivilegesDto) {
    const { privileges } = dto;
    return this.usersService.grantPrivileges(userId, privileges);
  }

  @Delete(':id/privileges')
  @ApiTags('Revoke administrator privileges. Root only.')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  public async revokePrivileges(@Param('id') userId, @Body() dto: ApiPrivilegesDto) {
    const { privileges } = dto;
    return this.usersService.revokePrivileges(userId, privileges);
  }

  @Put('users/:id/confirm')
  @ApiTags('Confirm regular user. Limited access.')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.confirmUser] })
  async confirm(@Param('id') _id: string) {
    return this.usersService.confirm(_id);
  }

  @Delete('users/:id/confirm')
  @ApiTags('Block regular user. Limited access.')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.blockUser] })
  async block(@Param('id') _id: string) {
    return this.usersService.block(_id);
  }

  @Put('users/:id/promote')
  @ApiTags('Promote regular user (raise status). Limited access.')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.promoteUser] })
  async upgrade(@Param('id') _id: string) {
    return this.usersService.upgrade(_id);
  }

  @Delete('users/:id/promote')
  @ApiTags('Downgrade regular user (lower status). Limited access.')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async downgrade(@Param('id') _id: string) {
    throw new MethodNotAllowedException('Этот метод нельзя использовать здесь!');
    // return this.usersService.downgrade(_id);
  }

  @Put('users/:id/keys')
  @ApiTags('Grant keys to regular user. Limited access.')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.giveKey] })
  async grantKeys(@Param('id') _id: string) {
    return this.usersService.grantKeys(_id);
  }

  @Delete('users/:id/keys')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  @ApiTags('Revoke keys from regular user. Limited access.')
  async revokeKeys(@Param('id') _id: string) {
    throw new MethodNotAllowedException('Этот метод нельзя использовать здесь!');
    //  return this.usersService.revokeKeys(_id);
  }

  @Post('blog')
  @ApiTags('Write a blog post. Limited access.')
  @AccessControlList({
    role: UserRole.ADMIN,
    rights: [AccessRights.createPost, AccessRights.contentEditor],
  })
  async createPost(@Request() req: Express.Request, @Body() dto: PostDTO) {
    return this.blogService.create(dto, req.user);
  }

  @Patch('blog/:id')
  @ApiTags('Edit a blog post. Limited access.')
  @AccessControlList({
    role: UserRole.ADMIN,
    rights: [AccessRights.updatePost, AccessRights.contentEditor],
  })
  async updatePost(@Request() req: Express.Request, @Param('id') id: string, @Body() dto: PostDTO) {
    return this.blogService.updatePost(id, dto, req.user);
  }

  @Delete('blog/:id')
  @ApiTags('Delete a blog post. Limited access.')
  @AccessControlList({
    role: UserRole.ADMIN,
    rights: [AccessRights.deletePost, AccessRights.contentEditor],
  })
  async deletePost(@Request() req: Express.Request, @Param('id') id: string) {
    return this.blogService.deletePost(id, req.user);
  }

  @Post('category')
  @ApiTags('Create a category. Root only.')
  @AccessControlList({
    role: UserRole.ADMIN,
    isRoot: true,
    rights: [AccessRights.categoryPoints],
  })
  public async createCategory(@Body() dto: ApiCreateCategoryDto, @Req() req: Express.Request) {
    return this.categoryService.createCategory(dto, req.user as AnyUserInterface);
  }

  @Patch('categories/:id')
  @ApiTags('Update category by id. Admins only.')
  @AccessControlList({
    role: UserRole.ADMIN,
    rights: [AccessRights.categoryPoints],
  })
  async updateCategoryById(
    @Param('id')
    id: string,
    @Body() dto: ApiUpdateCategoryDto,
    @Req() req: Express.Request
  ) {
    return this.categoryService.updateCategoryById(id, dto, req.user as AnyUserInterface);
  }

  @Delete('categories/:id')
  @ApiTags('Delete category by id. Root only.')
  @AccessControlList({
    role: UserRole.ADMIN,
    isRoot: true,
    rights: [AccessRights.categoryPoints],
  })
  async deleteCategoryById(@Param('id') id: string, @Req() req: Express.Request) {
    return this.categoryService.removeCategory(id, req.user as AnyUserInterface);
  }
  
  @Get('tasks/conflicted')
  @ApiTags('Get a list of conflicted tasks. Limited access.')
  @AccessControlList({
    role: UserRole.ADMIN,
    rights: [AccessRights.resolveConflict],
  })
  public async getConflictedTasks() {
    return this.tasksService.getVirginConflictTasks();
  }

  @Get('users/volunteers')
  @ApiTags('Get a list of volunteers')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.confirmUser] })
  public async getVolunteers() {
    return this.usersService.getUsersByRole(UserRole.VOLUNTEER);
  }

  @Get('users/recipients')
  @ApiTags('Get a list of volunteers')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.confirmUser] })
  public async getRecipients() {
    return this.usersService.getUsersByRole(UserRole.RECIPIENT);
  }

  @Get('users/unconfirmed')
  @ApiTags('Get a list of volunteers')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.confirmUser] })
  public async getUnconfirmed() {
    return this.usersService.getUnconfirmedUsers();
  }

  @Put('tasks/:id/resolve')
  @ApiTags('Start moderation')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.resolveConflict] })
  public async startModeration(@Param('id') taskId: string, @Req() req: Express.Request) {
    return this.tasksService.startModeration(taskId, req.user as AnyUserInterface);
  }

  @Put('tasks/:id/resolve/fulfill')
  @ApiTags('Resolve conflict as fulfilled')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.resolveConflict] })
  public async resolveFulfilled(@Param('id') taskId: string) {
    return this.tasksService.resolveConflict(taskId, ResolveResult.FULFILLED);
  }

  @Put('tasks/:id/resolve/reject')
  @ApiTags('Resolve conflict as rejected')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.resolveConflict] })
  public async resolveRejected(@Param('id') taskId: string) {
    return this.tasksService.resolveConflict(taskId, ResolveResult.REJECTED);
  }

  @Get('/tasks/moderated')
  @ApiTags('Get moderated by admin')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.resolveConflict] })
  public async getModeratedTasks(@Req() req: Express.Request) {
    return this.tasksService.getModeratedTasks(req.user as AnyUserInterface);
  }
}
