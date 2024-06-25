import { Report } from 'src/reports/reports.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  email: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Insert user with ID: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Update user with ID: ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Remove user with ID: ', this.id);
  }
}
