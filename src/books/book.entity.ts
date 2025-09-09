import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: true })
  available: boolean;

  @Column()
  author: string;

  @Column()
  publisher: string;

  @Column()
  description: string;

  @Column()
  category: string;
}
