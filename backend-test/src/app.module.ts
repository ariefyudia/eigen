import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';
import { Book } from './books/entities/book.entity';
import { Member } from './members/entities/member.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: '',
      database: 'eigen',
      entities: [Book, Member, Transaction],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Book, Member]),

    BooksModule,
    MembersModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
