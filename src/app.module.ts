import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';

import configuration from './config/configuration';
import { HashModule } from './common/hash/hash.module';
import { UsersRepositoryModule } from './datalake/users/users-repository.module';
import { CategoryRepositoryModule } from './datalake/category/category-repository.module';
import { TaskRepositoryModule } from './datalake/task/task-repository.module';
import { ConfidentialityPolicyModule } from './datalake/confidentiality-policy/confidentiality-policy.module';
import { AuthApiModule } from './api/auth-api/auth-api.module';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './core/users/users.module';
import { MongooseConfigService } from './config/database-config.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { CategoriesModule } from './core/categories/categories.module';
import { AdminApiModule } from './api/admin-api/admin-api.module';
import { BlogModule } from './core/blog/blog.module';
import { ContactsRepositoryModule } from './datalake/contacts/contacts-repository.module';
import { ContactsModule } from './core/contacts/contacts.module';
import { TasksModule } from './core/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: MongooseConfigService,
    }),
    HashModule,
    // ScheduleModule.forRoot(),
    TaskRepositoryModule,
    UsersRepositoryModule,
    ConfidentialityPolicyModule,
    AuthApiModule,
    AuthModule,
    UsersModule,
    CategoryRepositoryModule,
    CategoriesModule,
    AdminApiModule,
    BlogModule,
    ContactsRepositoryModule,
    ContactsModule,
    TasksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
