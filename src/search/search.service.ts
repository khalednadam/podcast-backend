import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { SearchDto } from './dto/search.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchResult } from './search-result.entity';
import { Repository } from 'typeorm';
import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import { UpdateSearchDto } from './dto/update-search.dto';
import * as _ from 'lodash';
import { Podcast } from '../types/podcast';
import { FetchDto } from './dto/fetch.dto';
import { Episode } from '../types/episode';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(SearchResult)
    private searchResultRepository: Repository<SearchResult>,
  ) {}

  /**
   * Search
   * @param searchDto
   */
  async search(searchDto: SearchDto) {
    const existingSearch = await this.findOne(searchDto.query);
    const isValidDate =
      existingSearch && this.isDateValid(existingSearch.updatedAt, new Date());

    // if exists and recent
    if (existingSearch && isValidDate) {
      return existingSearch;

      // if exists but not recent
    } else if (existingSearch && !isValidDate) {
      const apiSearchResult = await this.fetchApi(searchDto);

      // if exists and not recent but the result is still the same
      if (
        _.isEqual(apiSearchResult.podcasts, existingSearch.podcasts) &&
        _.isEqual(apiSearchResult.episodes, existingSearch.episodes)
      ) {
        await this.update({
          query: searchDto.query,
          updatedAt: new Date(),
        } as UpdateSearchDto);
        return existingSearch;

        // if exists and not recent and the result has changed
      } else {
        return apiSearchResult;
      }
    }

    // if it doesn't exist in the database
    const apiSearchResult = await this.fetchApi(searchDto);
    const newFetchedResults = await this.create({
      query: searchDto.query,
      episodes: apiSearchResult.episodes,
      episodesCount: apiSearchResult.episodesCount,
      podcasts: apiSearchResult.podcasts,
      podcastsCount: apiSearchResult.podcastsCount,
    });
    return newFetchedResults;
  }

  /**
   * Store search and result
   * @param createSearchDto
   */
  async create(createSearchDto: CreateSearchDto) {
    return this.searchResultRepository.save({
      query: createSearchDto.query,
      episodes: createSearchDto.episodes,
      episodesCount: createSearchDto.episodesCount,
      podcasts: createSearchDto.podcasts,
      podcastsCount: createSearchDto.podcastsCount,
    });
  }

  /**
   * Fetch podcasts from the iTunes API
   * @param fetchDto
   */
  async fetchApi(fetchDto: FetchDto): Promise<{
    podcasts: Podcast[];
    podcastsCount: number;
    episodes: Episode[];
    episodesCount: number;
  }> {
    const { podcasts, podcastsCount } = await this.fetchPodcasts(fetchDto);
    const { episodes, episodesCount } = await this.fetchEpisodes(fetchDto);

    const result = {
      podcasts,
      podcastsCount,
      episodes,
      episodesCount,
    };
    return result;
  }

  /**
   * Fetch podcasts from the iTunes API
   * @param fetchDto
   */
  async fetchPodcasts(
    fetchDto: FetchDto,
  ): Promise<{ podcasts: Podcast[]; podcastsCount: number }> {
    const podcastResults: AxiosResponse<{
      results: Podcast[];
      resultCount: number;
    }> = await axios.get(
      `https://itunes.apple.com/search?media=podcast&term=${fetchDto.query}`,
    );
    const results = {
      podcasts: podcastResults.data.results,
      podcastsCount: podcastResults.data.resultCount,
    };
    return results;
  }

  /**
   * Fetch podcasts from the iTunes API
   * @param fetchDto
   */
  async fetchEpisodes(
    fetchDto: FetchDto,
  ): Promise<{ episodes: Episode[]; episodesCount: number }> {
    const episodesResults: AxiosResponse<{
      results: Episode[];
      resultCount: number;
    }> = await axios.get(
      `https://itunes.apple.com/search?term=${fetchDto.query}&entity=podcastEpisode`,
    );
    const results = {
      episodes: episodesResults.data.results,
      episodesCount: episodesResults.data.resultCount,
    };
    return results;
  }

  /**
   * Find a results
   * @param query
   */
  async findOne(query: string) {
    const searchResult = await this.searchResultRepository.findOne({
      where: {
        query: query,
      },
      order: { updatedAt: 'DESC' },
    });
    return searchResult;
  }

  async update(updateSearchDto: UpdateSearchDto) {
    return this.searchResultRepository.update(
      {
        query: updateSearchDto.query,
      },
      {
        updatedAt: new Date(),
      },
    );
  }

  async remove(id: number) {
    return this.searchResultRepository.delete(id);
  }

  isDateValid(date1: Date, date2: Date) {
    const diffInMinutes = moment(date2).diff(moment(date1), 'minutes');
    return diffInMinutes < 5;
  }
}
