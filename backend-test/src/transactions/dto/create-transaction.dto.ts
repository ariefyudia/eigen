import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @Type(() => Books)
  books: Books[];
}

export class Books {}
