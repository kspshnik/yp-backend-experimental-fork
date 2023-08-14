/* eslint-disable import/no-cycle */
import { Length, IsString, IsUrl, IsDate } from 'class-validator';
import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { Task } from '../../tasks/entities/task.entity';
import { UserRole, StatusType, PermissionType } from '../../common/types/user-types';
import { Message } from '../../messages/entities/message.entity';
import { Chat } from '../../chats/entities/chat.entity';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @IsString()
  @Length(2, 20)
  fullname: string;

  @Column({ nullable: true })
  @IsString()
  role: UserRole | null;

  @Column({ nullable: true })
  status: StatusType | null;

  @Column()
  @IsUrl()
  vk: string;

  @Column()
  @IsUrl()
  avatar: string;

  @Column()
  @IsString()
  phone: string;

  @Column()
  @IsString()
  address: string;

  @Column()
  @IsString()
  coordinates: number[];

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column({ nullable: true })
  keys?: number | null;

  @Column()
  scores?: number;

  @Column({ nullable: true })
  permissions?: Array<PermissionType> | null;

  @OneToMany(() => Task, (task) => task.owner) // Указываем обратное поле в Task сущности
  tasks: Task[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @ManyToMany(() => Chat, (chat) => chat.participants) // Многие ко многим с чатами
  chats: Chat[];
}
