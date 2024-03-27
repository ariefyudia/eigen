import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum StatusLoan {
  LOAN = 'LOAN',
  RETURN = 'RETURN',
}
@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  bookId: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  expiredAt: Date;

  @Column({ nullable: true })
  returnDate: Date;

  @Column({
    type: 'enum',
    enum: StatusLoan,
    default: StatusLoan.LOAN,
  })
  status: StatusLoan;
}
