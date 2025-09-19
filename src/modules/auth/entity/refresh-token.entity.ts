import { UserEntity } from 'src/modules/user/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @Column({ default: false })
  isRevoked: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
