import { CoreEntity } from 'src/shared/entities/core.entity';
import { Column, Entity } from 'typeorm';

type AdminRole = 'admin' | 'superAdmin' | 'moderator';
@Entity()
export class Admin extends CoreEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: AdminRole;
}
