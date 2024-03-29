import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/book.entity';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}
  create(createMemberDto: CreateMemberDto) {
    return 'This action adds a new member';
  }

  async findAll() {
    const members = await this.dataSource.query(
      `SELECT members.*, 
      (SELECT COUNT(1) FROM transactions WHERE transactions.userId = members.code AND status = "LOAN") AS totalLoanActive,
      (SELECT COUNT(1) FROM transactions WHERE transactions.userId = members.code) AS totalLoan
      FROM members`,
    );
    return members;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
