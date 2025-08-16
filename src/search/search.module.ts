import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchResult } from './search-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SearchResult])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
