import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSearchDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
