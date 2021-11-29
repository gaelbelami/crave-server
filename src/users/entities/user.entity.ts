import { CoreEntity } from 'src/shared/entities/core.entity';
import { Column, Entity } from 'typeorm';

type UserRole = 'client' | 'owner' | 'delivery';

@Entity()
export class User extends CoreEntity {
  @Column()
  firstName: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column()
  phoneNumber: number;

  @Column()
  address: string;

  @Column()
  birthdate: Date;

  @Column() 
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;
}
