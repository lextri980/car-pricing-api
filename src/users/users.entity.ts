import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

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
