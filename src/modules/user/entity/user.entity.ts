import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleType } from '../../../guards/role-type';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ unique: true, nullable: true })
  keyCloakId?: string;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.USER,
  })
  role: RoleType;
}
