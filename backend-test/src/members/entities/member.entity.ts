import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('members')
export class Member {
  user: any;
  [x: string]: any;
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  penaltyUntil: Date;
}
