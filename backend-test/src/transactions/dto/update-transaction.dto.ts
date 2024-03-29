import { PartialType } from '@nestjs/mapped-types';
import { Books, CreateTransactionDto } from './create-transaction.dto';
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @Type(() => Books)
  books: Books[];
}
