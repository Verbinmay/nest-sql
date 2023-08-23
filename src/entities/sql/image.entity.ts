import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from './blog.entity';
import { Post } from './post.entity';

@Entity()
export class Images {
  constructor(
    url: string,
    width: number,
    height: number,
    fileSize: number,
    type: 'wallpaper' | 'main' | 'post',
    relation?: Blog | Post,
  ) {
    this.url = url;
    this.type = type;
    this.width = width;
    this.height = height;
    this.fileSize = fileSize;
    if (relation instanceof Blog) {
      this.blog = relation;
    }
    if (relation instanceof Post) {
      this.post = relation;
    }
  }
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public url: string;

  @Column()
  public type: 'wallpaper' | 'main' | 'post';

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

  @ManyToOne(() => Post, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post: Post;

  @OneToMany(() => Images, (employee) => employee.bigImage)
  anotherSizes: Images[];

  @ManyToOne(() => Images, (employee) => employee.anotherSizes, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  bigImage: Images;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;
}
