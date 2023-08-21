import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from './blog.entity';

@Entity()
export class Images {
  constructor(
    url: string,
    width: number,
    height: number,
    fileSize: number,
    type: 'wallpaper' | 'main',
    blog: Blog,
  ) {
    this.url = url;
    this.type = type;
    this.width = width;
    this.height = height;
    this.fileSize = fileSize;
    this.blog = blog;
  }
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
