import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/book.entity';
import { DataSource, IsNull, Repository } from 'typeorm';
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

    const checkQuota =
      createTransactionDto.books.length - checkTransactionUser.length;
    if (createTransactionDto.books.length > checkQuota && checkQuota !== 0) {
      throw new ForbiddenException(
        'User hanya bisa meminjam ' + checkQuota + ' buku lagi',
      );
    }

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
