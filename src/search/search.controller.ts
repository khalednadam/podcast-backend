import { Controller, Param, Delete, Query, Get } from '@nestjs/common';
import { SearchService } from './search.service';
import _ from 'lodash';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async findOne(@Query('query') query: string) {
    const existingSearch = await this.searchService.findOne(query);
    const isValidDate =
      existingSearch &&
      this.searchService.isDateValid(existingSearch.updatedAt, new Date());
    // if exists and recent
    if (existingSearch && isValidDate) {
      return existingSearch;

      // if exists but not recent
    } else if (existingSearch && !isValidDate) {
      const apiSearchResult = await this.searchService.fetchApi({ query });

      // if exists and not recent but the result is still the same
      if (
        _.isEqual(apiSearchResult.podcasts, existingSearch.podcasts) &&
        _.isEqual(apiSearchResult.episodes, existingSearch.episodes)
      ) {
        await this.searchService.update({
          query,
          updatedAt: new Date(),
        });
        return existingSearch;

        // if exists and not recent and the result has changed
      } else {
        return apiSearchResult;
      }
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.searchService.remove(+id);
  }
}
