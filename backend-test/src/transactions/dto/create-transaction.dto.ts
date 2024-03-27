import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @Type(() => Books)
  books: Books[];
}

export class Books {}
