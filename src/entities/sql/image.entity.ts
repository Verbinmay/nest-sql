import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { imageInfo } from '../../blogger/dto/avatar/view-avatar.dto';
import { Blog } from './blog.entity';
import { User } from './user.entity';

@Entity()
export class Images {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public url: string;

  @Column()
  public type: 'wallpaper' | 'main';

  @Column()
  public width: number;

  @Column()
  public height: number;

  @Column()
  public fileSize: number;

  @ManyToOne(() => Blog, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  blog: Blog;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;
}
