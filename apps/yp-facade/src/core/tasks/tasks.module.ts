import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksRepositoryModule } from '../../datalake/task/tasks-repository.module';
import { UsersRepositoryModule } from '../../datalake/users/users-repository.module';
import { CategoryRepositoryModule } from '../../datalake/category/category-repository.module';

@Module({
  imports: [TasksRepositoryModule, UsersRepositoryModule, CategoryRepositoryModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
