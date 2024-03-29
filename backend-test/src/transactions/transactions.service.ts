import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/book.entity';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import { Member } from 'src/members/entities/member.entity';
import { StatusLoan, Transaction } from './entities/transaction.entity';
import { NotEquals } from 'class-validator';
import * as dayjs from 'dayjs';

@Injectable()
export class TransactionsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    // Check penalty user
    const checkPenalty = await this.memberRepository.findOne({
      where: {
        code: createTransactionDto.userId,
      },
    });
    if (checkPenalty.penaltyUntil) {
      throw new ForbiddenException(
        'User masih terkena penalti untuk meminjam buku sampai ' +
          dayjs(checkPenalty.penaltyUntil).format('DD MMMM YYYY'),
      );
    }

    // Check loan user
    const checkTransactionUser = await this.transactionRepository.find({
      where: {
        userId: createTransactionDto.userId,
        status: StatusLoan.LOAN,
      },
    });

    if (checkTransactionUser.length >= 2) {
      throw new ForbiddenException(
        'User masih memiliki pinjaman buku yang belum dikembalikan',
      );
    }

    // Check kuota peminjaman user
    const checkQuota =
      createTransactionDto.books.length - checkTransactionUser.length;
    if (createTransactionDto.books.length > checkQuota && checkQuota !== 0) {
      throw new ForbiddenException(
        'User hanya bisa meminjam ' + checkQuota + ' buku lagi',
      );
    }

    // Check ketersediaan buku
    let messageStatusBook = [];
    for (const book of createTransactionDto.books) {
      const checkStok = await this.bookRepository.findOne({
        where: {
          code: book.toString(),
          stock: 1,
        },
      });
      if (!checkStok) {
        messageStatusBook.push(
          'Stok ' + book.toString() + ' buku tidak tersedia',
        );
      }

      const checkTransaction = await this.transactionRepository.findOne({
        where: {
          bookId: book.toString(),
          status: StatusLoan.LOAN,
        },
      });

      if (checkTransaction) {
        messageStatusBook.push(
          'Buku dengan kode ' + book.toString() + ' sedang dalam peminjaman',
        );
      }
    }

    if (messageStatusBook.length > 0) {
      throw new ForbiddenException(messageStatusBook);
    }

    // Proses peminjaman
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const book of createTransactionDto.books) {
        const transaction = await this.transactionRepository.create({
          userId: createTransactionDto.userId,
          bookId: book.toString(),
          createdAt: dayjs().format('YYYY-MM-DD'),
          expiredAt: dayjs().add(7, 'day').format('YYYY-MM-DD'),
        });
        await queryRunner.manager.save(transaction);

        const dataBook = await this.bookRepository.findOne({
          where: {
            code: book.toString(),
          },
        });
        dataBook.stock = dataBook.stock - 1;

        await queryRunner.manager.save(dataBook);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('Gagal simpan pinjam buku ' + err);
    } finally {
      await queryRunner.release();
    }

    return 'This action adds a new transaction';
  }

  async returnBook(updateTransactionDto: UpdateTransactionDto) {
    // Check loan user
    const transactions = await this.transactionRepository.find({
      where: {
        userId: updateTransactionDto.userId,
        bookId: In(updateTransactionDto.books),
        status: StatusLoan.LOAN,
      },
    });

    if (transactions.length == 0) {
      throw new NotFoundException('Transaksi peminjaman tidak ditemukan');
    }

    // Prose pengembalian buku
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const transaction of transactions) {
        const user = await this.memberRepository.findOne({
          where: { code: transaction.userId },
        });
        const book = await this.bookRepository.findOne({
          where: { code: transaction.bookId },
        });
        console.log(user, book);
        // Check expired return date
        let date1 = new Date(transaction.expiredAt);
        let date2 = new Date();

        let Difference_In_Time = date2.getTime() - date1.getTime();

        let Difference_In_Days = Math.round(
          Difference_In_Time / (1000 * 3600 * 24),
        );

        // Create penalty jika > 7 hari
        if (Difference_In_Days > 7) {
          user.penaltyUntil = dayjs().add(3, 'days').toDate();
          await queryRunner.manager.save(user);
        }

        book.stock = book.stock + 1;
        await queryRunner.manager.save(book);

        transaction.returnDate = dayjs().toDate();
        transaction.status = StatusLoan.RETURN;
        await queryRunner.manager.save(transaction);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('Gagal simpan pengembalian buku ' + err);
    } finally {
      await queryRunner.release();
    }

    return 'Buku berhasil dikembalikan';
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
