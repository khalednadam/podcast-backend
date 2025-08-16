import { PartialType } from '@nestjs/mapped-types';
import { CreateSearchDto } from './create-search.dto';
import { Podcast } from '../../types/podcast';
import { Episode } from '../../types/episode';

export class UpdateSearchDto extends PartialType(CreateSearchDto) {
  query: string;
  podcasts?: Podcast[];
  episodes?: Episode[];
  podcastsCount?: number;
  episodesCount?: number;
  updatedAt: Date;
}
