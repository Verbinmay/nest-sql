import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';

import { Blog } from './blog.entity';

@Entity()
@Index(['userId', 'blogId'], { unique: true })
export class BanedUsers {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
  @Column('uuid')
  public userId: string;
  @Column()
  public userLogin: string;
  @Column()
  public banReason: string;
  @Column()
  public banDate: Date;
  @Column('uuid')
  public blogId: Blog;
}
