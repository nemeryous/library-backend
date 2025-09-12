import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('books')
export class BookEntity {
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
