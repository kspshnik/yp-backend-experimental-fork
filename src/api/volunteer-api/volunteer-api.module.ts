import { Module } from '@nestjs/common';
import { TasksModule } from '../../core/tasks/tasks.module';
import { TasksService } from '../../core/tasks/tasks.service';
import { TasksRepositoryModule } from '../../datalake/task/tasks-repository.module';
import { UsersRepositoryModule } from '../../datalake/users/users-repository.module';
import { CategoryRepositoryModule } from '../../datalake/category/category-repository.module';
import { UsersModule } from '../../core/users/users.module';
import { CategoriesModule } from '../../core/categories/categories.module';
import { RecipientApiController } from '../recipient-api/recipient-api.controller';

@Module({
  imports: [
    TasksRepositoryModule,
    UsersRepositoryModule,
    CategoryRepositoryModule,
    TasksModule,
    UsersModule,
    CategoriesModule,
  ],
  controllers: [RecipientApiController],
  providers: [TasksService],
})
export class VolunteerApiModule {}
