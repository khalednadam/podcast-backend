import { IsNotEmpty, IsString } from 'class-validator';
import { Podcast } from '../../types/podcast';
import { Episode } from '../../types/episode';

export class CreateSearchDto {
  @IsString()
  @IsNotEmpty()
  query: string;
  podcasts: Podcast[];
  episodes: Episode[];
  podcastsCount: number;
  episodesCount: number;
}
