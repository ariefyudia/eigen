import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './books/entities/book.entity';
import { Repository } from 'typeorm';
import { Member } from './members/entities/member.entity';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async onModuleInit() {
    await this.seedData();
  }

  async seedData() {
    const books = await this.bookRepository.count();
    const members = await this.memberRepository.count();
    if (books == 0) {
      const mockBook = [
        {
          code: 'JK-45',
          title: 'Harry Potter',
          author: 'J.K Rowling',
          stock: 1,
        },
        {
          code: 'SHR-1',
          title: 'A Study in Scarlet',
          author: 'Arthur Conan Doyle',
          stock: 1,
        },
        {
          code: 'TW-11',
          title: 'Twilight',
          author: 'Stephenie Meyer',
          stock: 1,
        },
        {
          code: 'HOB-83',
          title: 'The Hobbit, or There and Back Again',
          author: 'J.R.R. Tolkien',
          stock: 1,
        },
        {
          code: 'NRN-7',
          title: 'The Lion, the Witch and the Wardrobe',
          author: 'C.S. Lewis',
          stock: 1,
        },
      ];

      const book = await this.bookRepository.create(mockBook);
      await this.bookRepository.save(book);
    }

    if (members == 0) {
      const mockMember = [
        {
          code: 'M001',
          name: 'Angga',
        },
        {
          code: 'M002',
          name: 'Ferry',
        },
        {
          code: 'M003',
          name: 'Putri',
        },
      ];

      const member = await this.memberRepository.create(mockMember);
      await this.memberRepository.save(member);
    }
    console.log('ok gas ', books);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
