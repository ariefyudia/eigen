import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/book.entity';
import { Member } from './entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Member])],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
